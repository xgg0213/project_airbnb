import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSpot, addImagesToSpot } from '../../store/spot';
import { useNavigate, useParams } from 'react-router-dom'; 
import { fetchSingleSpot, updateASpot, clearSingleSpot } from '../../store/spot';
import './SpotForm.css';

const SpotForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const {spotId} = useParams();
  const spot = useSelector((state) => state.spot.singleSpot || {});
//   const spotImages = useSelector((state) => state.spot.)
  const isUpdateMode = Boolean(spotId);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
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
  const [isLoading, setIsLoading] = useState(true); 

//   console.log(spot);
// populate the form if the spotId already exists
useEffect(() => {
  const loadSpot = async () => {
    if (isUpdateMode) {
      await dispatch(fetchSingleSpot(spotId));
    } else {
      dispatch(clearSingleSpot());
    }
    setIsLoading(false); 
  };
  loadSpot();
}, [dispatch, spotId, isUpdateMode]);


// Reset form state when the component mounts
useEffect(() => {
    if (isUpdateMode && spot?.id) {
        const images_array = spot?.SpotImages
        // console.log(images_array);
        const previewImage = images_array.find((img) => img.preview)?.url || '';
        const otherImages = images_array.filter((img) => !img.preview);
        setName(spot.name?spot.name:'');
        setAddress(spot.address?spot.address:'');
        setCity(spot.city?spot.city:'');
        setState(spot.state?spot.state:'');
        setCountry(spot.country?spot.country:'');
        setLat(spot.lat?spot.lat:0);
        setLng(spot.lng?spot.lng:0);
        setPrice(spot.price?spot.price:'');
        setDescription(spot.description?spot.description:'');
        setPreviewImage(previewImage?previewImage:'');
        setImage1(otherImages[0]?otherImages[0].url:'');
        setImage2(otherImages[1]?otherImages[1].url:'');
        setImage3(otherImages[2]?otherImages[2].url:'');
        setImage4(otherImages[3]?otherImages[3].url:'');
        setErrors({});
        setFormSubmitted(false)
    } 
    else {
        setName('');
        setAddress('');
        setCity('');
        setState('');
        setLat('');
        setLng('');
        setCountry('');
        setPrice('');
        setDescription('');
        setPreviewImage('');
        setImage1('');
        setImage2('');
        setImage3('');
        setImage4('');
        setErrors({});
        setFormSubmitted(false);
    }
}, [isUpdateMode, spot]); 


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true)

    // Validation
    const validationErrors = {};
    if (!country) validationErrors.country = 'Country is required';
    if (!address) validationErrors.address = 'Street Address is required';
    if (!city) validationErrors.city = 'City is required';
    if (!state) validationErrors.state = 'State is required';
    if (!lat) validationErrors.lat = 'Latitude is required';
    if (!lng) validationErrors.lng = 'lng is required';
    if (description.length < 30) validationErrors.description = 'Description needs 30 or more characters';
    if (!name) validationErrors.name = 'Title is required';
    if (!price || price <= 0) validationErrors.price = 'Price per night is required';
    if (!previewImage) validationErrors.previewImage = 'Preview Image URL is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = {
      name,
      address,
      city,
      state,
      lat,
      lng,
      country,
      price,
      description,
    };

    let updatedData = formData;
    // console.log(spot)
    // console.log(isUpdateMode);
    // Only include changes in the update mode 
    if (isUpdateMode) {
      updatedData = {};
      
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== spot[key]) {
          updatedData[key] = formData[key];
          // console.log(key)
        }
      });
      // console.log(updatedData)
    }

    // Submit only if there are changes
    let result;
    if (isUpdateMode && Object.keys(updatedData).length > 0) {
      // console.log(spotId);
      result = await dispatch(updateASpot(spotId, updatedData));
      navigate(`/spots/${spotId}`)
    } else if (isUpdateMode) {
      navigate(`/spots/${spotId}`)
    }
    
    else if (!isUpdateMode) {
      result = await dispatch(createSpot(formData));
      // Handle images
      // When creating a new spot
 
      const newImages = [
        { url: previewImage, preview: true },
        ...(image1 ? [{ url: image1, preview: false }] : []),
        ...(image2 ? [{ url: image2, preview: false }] : []),
        ...(image3 ? [{ url: image3, preview: false }] : []),
        ...(image4 ? [{ url: image4, preview: false }] : []),
      ];
  
      await dispatch(addImagesToSpot(result.id, newImages));
      navigate(`/spots/${result.id}`)
    }

    if (isLoading) {
      return <p>Loading...</p>;
    }
    

  };

  return (
    <div className="new-spot-form-container">
      <h1>{isUpdateMode?'Update your spot': 'Create a New Spot'}</h1>
      <form onSubmit={handleSubmit} className="spot-form">
        {errors.length > 0 && (
          <ul className="form-errors">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        )}

        {/* Section 1 */}
        <h2>Where&apos;s your place located?</h2>
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
            id='country-input'
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
            id='street-input'
          />
          {formSubmitted && errors.address && <p className="field-error">{errors.address}</p>}
        </label>

        <div className='city-state-containter'>
          <label>
            City
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              id='city-input'
            />
            {formSubmitted && errors.city && <p className="field-error">{errors.city}</p>}
          </label>
          <span className='comma-state'> , </span>
          <label>
            State
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              id='state-input'
            />
            {formSubmitted && errors.state && <p className="field-error">{errors.state}</p>}
          </label>

        </div>
        <div className='lat-lng-containter'>
          <label>
            Latitude
            <input
              type="number"
              placeholder="lat"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              id='lat-input'
            />
            {formSubmitted && errors.lat && <p className="field-error">{errors.lat}</p>}
          </label>
            <span className='comma-lat'> , </span>
          <label>
            Longitude
            <input
              type="number"
              placeholder="lng"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              id='lng-input'
            />
            {formSubmitted && errors.lng && <p className="field-error">{errors.lng}</p>}
          </label>
        </div>
        <hr className='divider' />
        {/* Section 2 */}
        <h2>Describe your place to guests</h2>
        <p className="section-caption">
        Mention the best features of your space, any special amentities like fast 
        wifi or parking, and what you love about the neighborhood.
        </p>
        <label>
          {/* Description */}
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id='description'
          ></input>
          {formSubmitted && errors.description && <p className="field-error">{errors.description}</p>}
        </label>
        <hr className="divider" />
        {/* Section 3 */}
        <h2>Create a title for your spot</h2>
        <p className="section-caption">
        Catch guests&apos; attention with a spot title that highlights what makes your place special.
        </p>
        <label>
          {/* Title */}
          <input
            type="text"
            placeholder="Name of your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id='title-input'
          />
          {formSubmitted && errors.name && <p className="field-error">{errors.name}</p>}
        </label>
        <hr className="divider" />
        {/* Section 4 */}
        <h2>Set a base price for your spot</h2>
        <p className="section-caption">
        Competitive pricing can help your listing stand out and rank higher in search results.
        </p>
        <div id='price-section'>
          <div id='dollor-sign'>$ </div> 
          <input
            type="number"
            placeholder="Price per night (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {formSubmitted && errors.price && <p className="field-error">{errors.price}</p>}
        </div>
        <hr className="divider" />
        {/* Section 5 */}
        <h2>Liven up your spot with photos</h2>
        <p className="section-caption">
        Submit a link to at least one photo to publish your spot.
        </p>
        <label>
          <input
            type="text"
            placeholder="Preview Image URL"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            id='image-url'
          />
          {formSubmitted && errors.previewImage && <p className="field-error">{errors.previewImage}</p>}
        </label>
        <label>
          {/* Image 1 */}
          <input
            type="text"
            placeholder="Image URL"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
          />
        </label>
        <label>
          {/* Image 2 */}
          <input
            type="text"
            placeholder="Image URL"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
            id='image-url'
          />
        </label>
        <label>
          {/* Image 3 */}
          <input
            type="text"
            placeholder="Image URL"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
            id='image-url'
          />
        </label>
        <label>
          {/* Image 4 */}
          <input
            type="text"
            placeholder="Image URL"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
            id='image-url'
          />
        </label>
        <hr className="divider" />
        <div className="new-spot-button-container">
        <button type="submit" id='new-spot-button'>{isUpdateMode ? 'Update your Spot' : 'Create Spot'}</button>
        </div>
        
      </form>
    </div>
  );
};

export default SpotForm;