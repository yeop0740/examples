package org.heeyeop.sslpractice.infrastructure;

import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.openssl.PEMEncryptedKeyPair;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.pkcs.PKCS8EncryptedPrivateKeyInfo;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;

/**
 * CERT, PRIVATE KEY 등의 필요한 형식만을 포함한 파일임을 확인하는 메서드가 필요할 수 있음
 */
@Slf4j
@Component
public class PrivateKeyUtils {

    /**
     * PemReader 도 있음.
     */
    public boolean hasEncryptedPrivateKey(MultipartFile file) {
        try (Reader r = new InputStreamReader(file.getInputStream());
        PEMParser parser = new PEMParser(r)) {
            Object obj;

            while ((obj = parser.readObject()) != null) {
                if (obj instanceof PEMKeyPair) {
                    return false;
                }

                if (obj instanceof PrivateKeyInfo) {
                    return false;
                }

                if (obj instanceof PEMEncryptedKeyPair) {
                    return true;
                }

                if (obj instanceof PKCS8EncryptedPrivateKeyInfo) {
                    return true;
                }
            }

            // file 에 private key를 포함하지 않는 경우도 포함
//            throw new RuntimeException("invalid file format");
            // openssl 을 이용하여 암호화된 private key, 암호화 되지 않은 private key, 이를 가지고 certificate 을만들 수 있는 명령어 알려줘
            return false;
        } catch (IOException e) {
            log.error("Failed to read file", e);
            return false;
        }
    }

}
