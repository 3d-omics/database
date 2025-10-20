import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBluesky, faGithub, faYoutube, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const SocialIcons = ({ ulClassName = '' }: { ulClassName?: string }) => {

  const icons = [
    { icon: faBluesky, url: 'https://bsky.app/profile/3domics.bsky.social' },
    { icon: faGithub, url: 'https://github.com/3d-omics' },
    { icon: faYoutube, url: 'https://www.youtube.com/channel/UCELmDxgD1-AV0ObFl9UZNyQ' },
    { icon: faLinkedinIn, url: 'https://www.linkedin.com/company/79361799/admin/dashboard/' },
  ]

  return (
    <ul className={`flex mx-auto w-fit ${ulClassName}`} data-testid='social-icons'>
      {icons.map(({ icon, url }, i) => (
        <li key={i}>
          <Link to={url}>
            <FontAwesomeIcon icon={icon} />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SocialIcons;