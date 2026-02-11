package org.heeyeop.sslpractice.infrastructure;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.FileInputStream;
import java.nio.charset.StandardCharsets;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class PemX509CertificateConverterTest {

    private final PemX509CertificateConverter converter = new PemX509CertificateConverter();

    @Test
    @DisplayName("PEM 파일을 읽어서 X509Certificate 리스트로 변환한다 (다건 포함)")
    void fromPem() throws Exception {
        // given
        String filePath = "data/google_com.pem"; // 프로젝트 내에 존재하는 실제 데이터 활용
        FileInputStream fileInputStream = new FileInputStream(filePath);
        MockMultipartFile multipartFile = new MockMultipartFile(
                "file",
                "google_com.pem",
                "application/x-pem-file",
                fileInputStream
        );

        // when
        List<X509Certificate> certificates = converter.fromPem(multipartFile);

        // then
        assertThat(certificates).isNotEmpty();
        assertThat(certificates).hasSize(3);
    }

    @Test
    @DisplayName("Certificate 리스트를 PEM 포맷의 byte array로 변환 시 헤더와 푸터가 포함되어야 한다")
    void toArray_Format() throws Exception {
        // given
        String filePath = "data/google_com.pem";
        FileInputStream fileInputStream = new FileInputStream(filePath);
        MockMultipartFile multipartFile = new MockMultipartFile(
                "file",
                "google_com.pem",
                "application/x-pem-file",
                fileInputStream
        );
        List<X509Certificate> originalCertificates = converter.fromPem(multipartFile);
        List<Certificate> certs = new ArrayList<>(originalCertificates);

        // when
        byte[] bytes = converter.toArray(certs);
        String pemContent = new String(bytes, StandardCharsets.UTF_8);

        // then
        assertThat(pemContent).contains("-----BEGIN CERTIFICATE-----");
        assertThat(pemContent).contains("-----END CERTIFICATE-----");
        // Base64 인코딩 줄바꿈 확인 (MimeEncoder 사용 여부)
        assertThat(pemContent).contains("\n");
    }

    @Test
    @DisplayName("Round-trip 테스트: PEM -> 객체 -> PEM 변환 시 데이터가 유지되어야 한다")
    void roundTrip() throws Exception {
        // given
        String filePath = "data/google_com.pem";
        FileInputStream fileInputStream = new FileInputStream(filePath);
        MockMultipartFile multipartFile = new MockMultipartFile(
                "file",
                "google_com.pem",
                "application/x-pem-file",
                fileInputStream
        );
        
        // 1. PEM -> List<X509Certificate>
        List<X509Certificate> originalCertificates = converter.fromPem(multipartFile);
        List<Certificate> certs = new ArrayList<>(originalCertificates);

        // when
        // 2. List<Certificate> -> byte[] (PEM)
        byte[] generatedPemBytes = converter.toArray(certs);

        // 3. byte[] (PEM) -> List<X509Certificate> (다시 파싱)
        MockMultipartFile generatedMultipartFile = new MockMultipartFile(
                "file",
                "generated.pem",
                "application/x-pem-file",
                generatedPemBytes
        );
        List<X509Certificate> roundTripCertificates = converter.fromPem(generatedMultipartFile);

        // then
        assertThat(roundTripCertificates).hasSize(originalCertificates.size());
        // 첫 번째 인증서의 내용이 같은지 확인
        assertThat(roundTripCertificates.get(0).getEncoded()).isEqualTo(originalCertificates.get(0).getEncoded());
    }
}
