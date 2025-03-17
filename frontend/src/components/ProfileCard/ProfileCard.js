import classes from './ProfileCard.module.css';

function ProfileCard( 
    { imageUrl, name, bio }
) {
    return (
        <div className={classes.container}>
            <img src={imageUrl} alt={name} />
            <div className={classes.info}>
                <h2 className={classes.name}>{name}</h2>
                <p className={classes.bio}>{bio}</p>

                <div className={classes.icon}>
                    <a href='https://www.facebook.com/'><i className='fa-brands fa-facebook-f'></i></a>
                    <a href='x.com'><i className='fa-brands fa-twitter'></i></a>
                    <a href='instagram.com'><i className='fa-brands fa-instagram'></i></a>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;