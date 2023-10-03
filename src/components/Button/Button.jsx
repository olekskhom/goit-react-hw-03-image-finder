import PropTypes from 'prop-types';
import css from './Button.module.css';

export function Button({ onClick, hasImages }) {
  return (
    <>
      {hasImages && (
        <button className={css.button} type="button" onClick={onClick}>
          Load more
        </button>
      )}
    </>
  );
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  hasImages: PropTypes.bool.isRequired, 
};


