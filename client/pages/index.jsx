const LandingPage = ({ color }) => {
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = () => {
  console.log("I'm server side baby!");
  return {};
};

export default LandingPage;
