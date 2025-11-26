import json
import re

# Load the original dashboard
with open('23244_rev2.json', 'r') as f:
    dashboard = json.load(f)

# 1. Update Datasource
# We'll use a variable for datasource to make it portable, or just set it to default 'Prometheus'
# But better to use the UID if we knew it. Since we don't, let's assume the user has a datasource named 'Prometheus'.
# Or better, we can make a templating variable for datasource.
datasource_name = "Prometheus"
datasource_uid = "prometheus" # Common default UID, or we can leave it blank to let Grafana find it by type.

# Helper to update datasource in panels
def update_datasource(panels):
    for panel in panels:
        if 'datasource' in panel:
             # Set to a specific UID if known, or use a variable like ${DS_PROMETHEUS}
             # For this environment, let's assume the default Prometheus datasource is used.
             panel['datasource'] = {"type": "prometheus", "uid": "${DS_PROMETHEUS}"}
        
        if 'panels' in panel: # Row or nested panels
            update_datasource(panel['panels'])

# 2. Update Variables (Templating)
# Remove existing variables and add standard ones for Prometheus/Cadvisor
dashboard['templating']['list'] = [
    {
        "current": {"text": "Prometheus", "value": "Prometheus"},
        "hide": 0,
        "includeAll": False,
        "label": "Datasource",
        "multi": False,
        "name": "DS_PROMETHEUS",
        "options": [],
        "query": "prometheus",
        "refresh": 1,
        "regex": "",
        "skipUrlSync": False,
        "type": "datasource"
    },
    {
        "definition": "label_values(up{job=\"postgres-exporter\"}, instance)",
        "hide": 0,
        "includeAll": False,
        "label": "Instance",
        "multi": False,
        "name": "instance",
        "options": [],
        "query": {
            "query": "label_values(up{job=\"postgres-exporter\"}, instance)",
            "refId": "StandardVariableQuery"
        },
        "refresh": 1,
        "regex": "",
        "sort": 1,
        "type": "query"
    }
]

# 3. Update Panels & Queries
# Mapping of old metric names to new PromQL queries
# We use $instance variable which we defined above.
metric_map = {
    # Transaction/Connection metrics
    r'pg_active_transactions.*': 'pg_stat_activity_count{state="active", instance="$instance"}',
    r'pg_active_connections.*': 'pg_stat_activity_count{state="active", instance="$instance"}',
    r'pg_total_connections.*': 'pg_stat_activity_count{instance="$instance"}',
    r'pg_lock_sessions.*': 'pg_locks_count{instance="$instance"}', # Assuming standard metric
    r'pg_total_deadlocks.*': 'pg_stat_database_deadlocks{instance="$instance"}',
    r'pg_replication_lag.*': 'pg_replication_lag{instance="$instance"}',
    
    # CPU/Memory (Map to cAdvisor)
    # We assume the database container name is 'pg-prometheus-database-1' based on docker-compose
    r'cpu_usage.*': 'sum(rate(container_cpu_usage_seconds_total{name="pg-prometheus-database-1"}[1m])) * 100',
    r'mem_usage.*': 'container_memory_usage_bytes{name="pg-prometheus-database-1"}',
    r'mem_used.*': 'container_memory_usage_bytes{name="pg-prometheus-database-1"}',
    
    # Disk (Map to cAdvisor fs metrics)
    # cAdvisor gives total usage, not split by "logstorage" vs "defaultstorage"
    r'pg_.*storage_disk_used_percent.*': 'container_fs_usage_bytes{name="pg-prometheus-database-1"} / container_fs_limit_bytes{name="pg-prometheus-database-1"} * 100',
    r'pg_.*storage_disk_used.*': 'container_fs_usage_bytes{name="pg-prometheus-database-1"}',
    
    # Network (Map to cAdvisor network metrics)
    r'pg_network_rx_bytes_persec.*': 'rate(container_network_receive_bytes_total{name="pg-prometheus-database-1"}[1m])',
    r'pg_network_tx_bytes_persec.*': 'rate(container_network_transmit_bytes_total{name="pg-prometheus-database-1"}[1m])',
    
    # Buffer Hit Ratio (Standard postgres_exporter metric)
    r'pg_buffer_hit_ratio.*': 'pg_stat_database_blks_hit{instance="$instance"} / (pg_stat_database_blks_hit{instance="$instance"} + pg_stat_database_blks_read{instance="$instance"}) * 100',
}

def update_targets(panels):
    for panel in panels:
        if 'targets' in panel:
            for target in panel['targets']:
                if 'expr' in target:
                    original_expr = target['expr']
                    # Check for matches in our map
                    for pattern, replacement in metric_map.items():
                        if re.search(pattern, original_expr):
                            target['expr'] = replacement
                            # Reset legend format if it was specific to old labels
                            if 'legendFormat' in target:
                                target['legendFormat'] = "{{instance}}" 
                            break
        
        if 'panels' in panel:
            update_targets(panel['panels'])

# Apply updates
update_datasource(dashboard['panels'])
update_targets(dashboard['panels'])

# Update Title and UID to avoid conflict
dashboard['title'] = "PostgreSQL Dashboard (Customized)"
dashboard['uid'] = "postgres-custom-v1"
dashboard['id'] = None # Let Grafana assign a new ID

# Save to new file
with open('dashboard.json', 'w') as f:
    json.dump(dashboard, f, indent=2)

print("Successfully created dashboard.json")
