import InfoPage from "./InfoPage.jsx";

export default function TermsOfService() {
  const content = (
    <>
      <h2>Acceptance of Terms</h2>
      <p>
        By accessing and using PharmaNear, you agree to comply with these
        Terms of Service. If you do not agree, please discontinue use of
        the platform.
      </p>

      <h2>About PharmaNear</h2>
      <p>
        PharmaNear helps users locate nearby pharmacies, search medicine
        availability, and access pharmacy-related information. The platform
        is intended for informational and convenience purposes only.
      </p>

      <h2>User Responsibilities</h2>
      <ul>
        <li>Provide accurate information when using the platform.</li>
        <li>Use PharmaNear only for lawful purposes.</li>
        <li>Do not attempt to disrupt or misuse the service.</li>
        <li>Do not use automated tools to scrape platform data.</li>
      </ul>

      <h2>Medical Disclaimer</h2>
      <p>
        PharmaNear does not provide medical advice, diagnosis, or treatment.
        Users should consult licensed healthcare professionals for medical
        concerns.
      </p>

      <h2>Accuracy of Information</h2>
      <p>
        We strive to provide accurate information, but pharmacy inventory,
        medicine availability, pricing, and operating hours may change
        without notice.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content, branding, and platform materials belong to PharmaNear
        unless otherwise stated.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        PharmaNear shall not be liable for damages arising from the use or
        inability to use the platform.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        These terms may be updated periodically. Continued use of PharmaNear
        constitutes acceptance of revised terms.
      </p>
    </>
  );

  return <InfoPage title="Terms of Service" content={content} />;
}