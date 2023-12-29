import ReviewForm from '../components/Review/ReviewForm';
import WishForm from '../components/Wishlist/Wishlistform';

export default function ReviewPage() { 
  return (
    <div className='columns'>
      <div className='column'>
        <ReviewForm></ReviewForm>
      </div>
      <div className='column'>
        <WishForm></WishForm>
      </div>
    </div>
  );  
}