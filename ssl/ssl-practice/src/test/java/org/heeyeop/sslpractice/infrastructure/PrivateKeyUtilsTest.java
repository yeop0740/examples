package org.heeyeop.sslpractice.infrastructure;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

class PrivateKeyUtilsTest {

    private static final String DIR_PATH = "data";

    private final PrivateKeyUtils keyUtils = new PrivateKeyUtils();

    @DisplayName("data 디렉토리의 PEM 파일들을 읽어 암호화 여부를 확인한다")
    @ParameterizedTest
    @CsvSource({
            "google_com.pem,     false", // private key 존재 X
            "invalid_format.pem, false", // invalid format
            "rsa.key, false", // 암호화 하지 않은 private key
            "encrypted_rsa.key, true", // 암호화 한 private key
            "dcdsa.key, false", // 암호화 하지 않은 private key
            "encrypted_dcdsa.key, true", // 암호화 한 private key
            "ed25519.key, false", // 암호화 하지 않은 private key
            "encrypted_ed25519.key, true", // 암호화 한 private key
            "rsa.pem, false", // 암호화 하지 않은 private key + certificate
            "encrypted_rsa.pem, true", // 암호화 한 private key + certificate
            "dcdsa.pem, false", // 암호화 하지 않은 private key + certificate
            "encrypted_dcdsa.pem, true", // 암호화 한 private key + certificate
            "ed25519.pem, false", // 암호화 하지 않은 private key + certificate
            "encrypted_ed25519.pem, true", // 암호화 한 private key + certificate
    })
    void isEncrypted(String fileName, boolean expected) throws IOException {
        // given
        MultipartFile file = loadFile(fileName);

        // when
        boolean isEncrypted = keyUtils.hasEncryptedPrivateKey(file);

        // then
        assertThat(isEncrypted).isEqualTo(expected);
    }

    private MockMultipartFile loadFile(String fileName) {
        Path path = Path.of(DIR_PATH, fileName);
        try (InputStream is = new FileInputStream(path.toFile())) {
            return new MockMultipartFile(fileName, fileName, "application/x-pem-file", is);
        } catch (FileNotFoundException fne) {
            throw new RuntimeException("file not found error");
        } catch (IOException e) {
            throw new RuntimeException("file io error");
        }
    }

}
