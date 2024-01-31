import React, { useState } from 'react';
import { BsFillXCircleFill, BsCrop } from 'react-icons/bs';
import CropImage from './CropImage.js';

const CreateStory = () => {
    const [tempStories, setTempStories] = useState([]);
    const [showStory, setShowStory] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);


    const handleFileChange = (event) => {
        const newTempStories = [...tempStories];
        const files = event.target.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            newTempStories.push({
                id: i,
                src: URL.createObjectURL(file),
                type: file.type.startsWith('image/') ? 'image' : 'video'
            });
        }
        setTempStories(newTempStories);
        setShowStory(true);
    };

    const handleStorySubmit = () => {

    };

    const handleRemoveStory = (id) => {
        const updatedTempStories = tempStories.filter((story) => story.id !== id);
        setTempStories(updatedTempStories);
    };

    // close the story component
    const closeStory = () => {
        setTempStories([]);
        setShowStory(false);
    };

    const handleCropComplete = (croppedImageUrl) => {
        const updatedTempStories = tempStories.map((story) =>
      story.id === selectedImage.id ? { ...story, src: croppedImageUrl } : story
    );
        
        setTempStories(updatedTempStories);
        setSelectedImage(null);
    };

    const handleResultChange = (Result) => {
        const updatedTempStories = tempStories.map((story) =>
        story.id === selectedImage.id ? { ...story, src: Result } : story
      );
      
      setTempStories(updatedTempStories);
      setSelectedImage(null);
  };
       



    return (
        <>
            {/* {selectedImage ? (
              <CropImage selectedImage={selectedImage} onCropComplete={handleCropComplete} />
            ) :( */}
            <div className=' container container-create-story'>
                <form className='create-story-form'>
                    <label htmlFor="fileInput" className="custom-file-input btn">
                        {tempStories.length > 0
                            ? `Add more files (${tempStories.length} selected)`
                            : 'Choose File to add'}
                    </label>
                    <input id="fileInput" type="file" className='file-input' accept="image/*, video/*" multiple onChange={handleFileChange} />
                    <input type="submit" value='post' className="  btn btn-primary" onClick={handleStorySubmit} />
                </form>

                {showStory && (

                    <div className="story-grid">
                        <hr />
                        {tempStories.map((story) => (
                            <div key={story.id} className="story-item">

                                <div className='remove-icon' onClick={() => handleRemoveStory(story.id)}>
                                    <BsFillXCircleFill />
                                </div>
                                {selectedImage && selectedImage.id === story.id ? (
                                    <CropImage selectedImage={selectedImage} onCropComplete={handleCropComplete} />
                                ) : (<>
                                    {story.type === 'image' ? (
                                        <>
                                            <img className="story-content" src={story.src} alt={`Story ${story.id + 1}`} />
                                            <div className='crop-icon' onClick={() => setSelectedImage(story)}>
                                                <BsCrop />
                                            </div>

                                        </>
                                    ) : (
                                        <video className='story-content' controls>
                                            <source src={story.src} type="video/mp4" />
                                        </video>
                                    )
                                    }
                                </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* )} */}
        </>
    );
};

export default CreateStory;