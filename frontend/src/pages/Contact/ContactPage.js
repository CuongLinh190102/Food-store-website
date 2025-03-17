import classes from './ContactPage.module.css';
import ProfileCard from '../../components/ProfileCard/ProfileCard';

function ContactPage () {
  return (
    <div className={classes.container}>
      <h1>Our<span>Team</span></h1>
      <div className={classes.box}>
        <ProfileCard
            imageUrl="/team/chef1.png"
            name="John Doe"
            bio="CEO"
        />
        <ProfileCard
            imageUrl="/team/chef2.png"
            name="Jane Doe"
            bio="CTO"
        />
        <ProfileCard
            imageUrl="/team/chef3.jpg"
            name="Alice Doe"
            bio="CFO"
        />
        <ProfileCard
            imageUrl="/team/chef4.jpg"
            name="Bob Doe"
            bio="COO"
        />
      </div>
    </div>
  );
}

export default ContactPage;