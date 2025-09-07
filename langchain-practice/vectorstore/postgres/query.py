import os
from dotenv import load_dotenv
from langchain_postgres import PGEngine, PGVectorStore
from langchain_openai import OpenAIEmbeddings

load_dotenv()

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
connection_string = os.environ.get('DATABASE_URL')
engine = PGEngine.from_connection_string(url=connection_string)
table_name = 'news_articles'
vector_size = 1536
store = PGVectorStore.create_sync(
    engine=engine,
    table_name=table_name,
    embedding_service=embeddings
)

query = '삼성전자의 ai 관련 사업 계획에 대해 알려줘'
docs_with_score = store.similarity_search(query)

for doc in docs_with_score:
    print('-' * 80)
    # print('Score: ', score)
    print(doc.page_content)
