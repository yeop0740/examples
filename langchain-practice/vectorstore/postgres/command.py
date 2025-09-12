import os
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_community.document_loaders import WebBaseLoader
from langchain_postgres import PGEngine, PGVectorStore
import bs4

load_dotenv()

urls = ['https://n.news.naver.com/article/015/0005181264?sid=101', 'https://n.news.naver.com/article/015/0005181404?sid=101', 'https://n.news.naver.com/article/newspaper/015/0005180364?date=20250905', 'https://n.news.naver.com/mnews/article/015/0005181396?sid=105']
loader = WebBaseLoader(
    web_paths=urls,
    bs_kwargs=dict(
        parse_only=bs4.SoupStrainer(
            "div",
            attrs={"class": ["newsct_article _article_body",
                             "media_end_head_title"]},
        )
    ),
)
docs = loader.load()

# OpenAI의 "text-embedding-3-small" 모델을 사용하여 임베딩을 생성합니다.
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

connection_string = os.environ.get('DATABASE_URL')
engine = PGEngine.from_connection_string(url=connection_string)
table_name = 'news_articles'
vector_size = 1536
engine.init_vectorstore_table(
    table_name=table_name,
    vector_size=vector_size
)

store = PGVectorStore.create_sync(
    engine=engine,
    table_name=table_name,
    embedding_service=embeddings
)

store.add_documents(docs)
