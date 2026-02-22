package org.heeyeop.k8sclientdemo1;

import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;

import java.io.FileReader;
import java.nio.file.Path;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

/**
 * .pem 파일(Certificate + Private Key가 결합된 형태)을 파싱하여
 * X509Certificate 및 PrivateKey로 분리하는 유틸리티 클래스입니다.
 */
public class PemUtils {

      public record PemData(X509Certificate certificate, PrivateKey privateKey) {
      }

      /**
       * 통합된 PEM 파일에서 Certificate와 PrivateKey를 객체로 분리하여 반환합니다.
       */
      public static PemData parsePemFile(Path inputPemPath) throws Exception {
            X509Certificate certificate = null;
            PrivateKey privateKey = null;

            try (PEMParser pemParser = new PEMParser(new FileReader(inputPemPath.toFile()))) {
                  Object object;
                  while ((object = pemParser.readObject()) != null) {
                        if (object instanceof X509CertificateHolder holder) {
                              certificate = new JcaX509CertificateConverter()
                                          .getCertificate(holder);
                        } else if (object instanceof PEMKeyPair keyPair) {
                              privateKey = new JcaPEMKeyConverter()
                                          .getPrivateKey(keyPair.getPrivateKeyInfo());
                        } else if (object instanceof PrivateKeyInfo info) {
                              // 암호화되지 않은 pkcs#8 형태의 Private Key 처리 등
                              privateKey = new JcaPEMKeyConverter()
                                          .getPrivateKey(info);
                        }
                  }
            }

            if (certificate == null || privateKey == null) {
                  throw new IllegalArgumentException("입력된 PEM 파일에 인증서 혹은 개인키가 누락되어 있습니다.");
            }

            return new PemData(certificate, privateKey);
      }

}
