# SSL Practice

> pass phrase 는 초기 비밀번호로 세팅
 
### RSA

암호화 되지 않은 private key
```shell
openssl genpkey -algorithm RSA \
  -pkeyopt rsa_keygen_bits:2048 \
  -out data/rsa.key
```

암호화된 private key
```shell
openssl genpkey -algorithm RSA \
  -pkeyopt rsa_keygen_bits:2048 \
  -aes-256-cbc \
  -out data/encrypted_rsa.key

# pass phrase 입력
```

### ECDSA(P-256)

암호화 되지 않은 private key
```shell
openssl genpkey -algorithm EC \
  -pkeyopt ec_paramgen_curve:prime256v1 \
  -out data/dcdsa.key
```

암호화 된 private key
```shell
openssl genpkey -algorithm EC \
  -pkeyopt ec_paramgen_curve:prime256v1 \
  -aes-256-cbc \
  -out data/encrypted_dcdsa.key
```

### ED25519
tls 1.3 에서 일반적으로 사용 가능

암호화 되지 않은 private key
```shell
openssl genpkey -algorithm Ed25519 \
  -out data/ed25519.key
```

암호화 된 private key
```shell
openssl genpkey -algorithm Ed25519 \
  -aes-256-cbc \
  -out data/encrypted_ed25519.key
```

### Certificate 생성

csr 생성
```shell
openssl req -new \
  -key rsa.key \
  -out rsa.csr
```

self-signed certificate 생성
```shell
openssl req -x509 -days 365 \
  -key <private_key_file> \
  -in <csr_file> \
  -out <certificate_file>
```

Warning: Not placing -key in cert or request since request is used
Warning: No -copy_extensions given; ignoring any extensions in the request


A challenge password []:비밀번호
An optional company name []:

### 하나의 파일로 병합
```shell
cat data/rsa.crt data/rsa.key > data/rsa.pem
```
