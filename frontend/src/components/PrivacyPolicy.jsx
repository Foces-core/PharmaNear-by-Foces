import InfoPage from "./InfoPage.jsx";

export default function PrivacyPolicy() {
  const content = (
    <>
      <h2>Information We Collect</h2>
      <ul>
        <li>Location information when permitted by the user.</li>
        <li>Basic usage data to improve platform functionality.</li>
        <li>Information voluntarily submitted through forms.</li>
      </ul>

      <h2>How We Use Information</h2>
      <ul>
        <li>To help users locate nearby pharmacies.</li>
        <li>To improve service quality and user experience.</li>
        <li>To maintain platform security.</li>
      </ul>

      <h2>Location Data</h2>
      <p>
        Location access is used solely to identify pharmacies near the user.
        Users may disable location permissions at any time.
      </p>

      <h2>Cookies and Analytics</h2>
      <p>
        PharmaNear may use cookies or similar technologies to understand
        usage trends and enhance performance.
      </p>

      <h2>Data Sharing</h2>
      <p>
        We do not sell personal information. Data may only be shared when
        required by law or to protect platform integrity.
      </p>

      <h2>Data Security</h2>
      <p>
        Reasonable measures are taken to protect user information, though no
        internet transmission can be guaranteed completely secure.
      </p>

      <h2>Your Rights</h2>
      <p>
        Users may request access, correction, or deletion of personal data
        where applicable.
      </p>

      <h2>Policy Updates</h2>
      <p>
        This Privacy Policy may be revised periodically. Continued use of
        PharmaNear indicates acceptance of the updated policy.
      </p>
    </>
  );

  return <InfoPage title="Privacy Policy" content={content} />;
}