package org.heeyeop.springcoreprinciplesadvanced;

import org.heeyeop.springcoreprinciplesadvanced.trace.logtrace.FieldLogTrace;
import org.heeyeop.springcoreprinciplesadvanced.trace.logtrace.LogTrace;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LogTraceConfig {

    @Bean
    public LogTrace logTrace() {
        return new FieldLogTrace();
    }

}
