import ProfilePage from "@components/ProfilePage.jsx";
import CustomerHeader from "@components/CustomerHeader";

export default function CustomerProfile() {
  return (
    <ProfilePage eyebrow="Account" header={<CustomerHeader />} title="My profile" />
  );
}
