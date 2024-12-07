import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSpot } from '../../store/spot';
import { useNavigate } from 'react-router-dom'; 
import './SpotForm.css';

const SpotForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  const [errors, setErrors] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true)

    // Validation
    const validationErrors = {};
    if (!country) validationErrors.country = 'Country is required';
    if (!address) validationErrors.address = 'Street Address is required';
    if (!city) validationErrors.city = 'City is required';
    if (!state) validationErrors.state = 'State is required';
    if (description.length < 30) validationErrors.description = 'Description needs 30 or more characters';
    if (!name) validationErrors.name = 'Title is required';
    if (!price || price <= 0) validationErrors.price = 'Price per night is required';
    if (!previewImage) validationErrors.previewImage = 'Preview Image URL is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newSpot = {
      name,
      address,
      city,
      state,
      country,
      price: parseFloat(price),
      description,
      previewImage,
      images: [image1, image2, image3, image4].filter(Boolean),
    };

    const result = await dispatch(createSpot(newSpot));
    console.log('Create Spot Result:', result); 

    if (result.errors) {
      setErrors(result.errors);
    } else {
      navigate(`/spots/${result.id}`); // Navigate to the new spot's detail page
    }
  };

  return (
    <div className="new-spot-form-container">
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit} className="new-spot-form">
        {errors.length > 0 && (
          <ul className="form-errors">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        )}

        {/* Section 1 */}
        <h1>Where&apos;s your place located?</h1>
        <p className="section-caption">
            Guests will only get your exact address once they booked a reservation.
        </p>
        <label>
          Country
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          {formSubmitted && errors.country && <p className="field-error">{errors.country}</p>}
        </label>
        <label>
          Street Address
          <input
            type="text"
            placeholder="Street Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {formSubmitted && errors.address && <p className="field-error">{errors.address}</p>}
        </label>
        <label>
          City
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {formSubmitted && errors.city && <p className="field-error">{errors.city}</p>}
        </label>
        <label>
          State
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          {formSubmitted && errors.state && <p className="field-error">{errors.state}</p>}
        </label>

        {/* Section 2 */}
        <h1>Describe your place to guests</h1>
        <p className="section-caption">
        Mention the best features of your space, any special amentities like fast 
        wifi or parking, and what you love about the neighborhood.
        </p>
        <label>
          Description
          <textarea
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {formSubmitted && errors.description && <p className="field-error">{errors.description}</p>}
        </label>

        {/* Section 3 */}
        <h1>Create a title for your spot</h1>
        <p className="section-caption">
        Catch guests&apos; attention with a spot title that highlights what makes your place special.
        </p>
        <label>
          Title
          <input
            type="text"
            placeholder="Name of your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {formSubmitted && errors.name && <p className="field-error">{errors.name}</p>}
        </label>

        {/* Section 4 */}
        <h1>Set a base price for your spot</h1>
        <p className="section-caption">
        Competitive pricing can help your listing stand out and rank higher in search results.
        </p>
        <label>
          Price
          <input
            type="number"
            placeholder="Price per night (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {formSubmitted && errors.price && <p className="field-error">{errors.price}</p>}
        </label>

        {/* Section 5 */}
        <h1>Liven up your spot with photos</h1>
        <p className="section-caption">
        Submit a link to at least one photo to publish your spot.
        </p>
        <label>
          Preview Image
          <input
            type="text"
            placeholder="Preview Image URL"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
          />
          {formSubmitted && errors.previewImage && <p className="field-error">{errors.previewImage}</p>}
        </label>
        <label>
          Image 1
          <input
            type="text"
            placeholder="Image URL"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
          />
        </label>
        <label>
          Image 2
          <input
            type="text"
            placeholder="Image URL"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
          />
        </label>
        <label>
          Image 3
          <input
            type="text"
            placeholder="Image URL"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
          />
        </label>
        <label>
          Image 4
          <input
            type="text"
            placeholder="Image URL"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
          />
        </label>
        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default SpotForm;