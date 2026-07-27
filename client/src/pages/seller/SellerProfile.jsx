import ProfilePage from "@components/ProfilePage.jsx";
import SellerHeader from "@components/SellerHeader";

export default function SellerProfile() {
  return (
    <ProfilePage
      eyebrow="Studio Account"
      header={<SellerHeader />}
      title="Seller profile"
    />
  );
}
