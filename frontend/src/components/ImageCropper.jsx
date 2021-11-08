import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button, Grid, Slider, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { getOrientation } from 'get-orientation/browser';
import { getCroppedImg, getRotatedImage } from '../resources/canvaUtils.js';

const useStyles = makeStyles(theme => ({
    cropContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
        background: '#333',
        [theme.breakpoints.up('sm')]: {
            height: 400,
        },
    },
    cropButton: {
        flexShrink: 0,
        marginLeft: 16,
    },
    controls: {
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            alignItems: 'center',
        },
    },
    sliderContainer: {
        display: 'flex',
        flex: '1',
        alignItems: 'center',
    },
    sliderLabel: {
        [theme.breakpoints.down('xs')]: {
            minWidth: 65,
        },
    },
    slider: {
        padding: '22px 0px',
        marginLeft: 16,
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            alignItems: 'center',
            margin: '0 16px',
        },
    },
    img: {
        maxWidth: '50%',
        maxHeight: '50%',
    },
    mt2: {
        marginTop: theme.spacing(2)
    }
}));

const ORIENTATION_TO_ANGLE = {
    '3': 180,
    '6': 90,
    '8': -90,
};

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result), false);
        reader.readAsDataURL(file);
    })
}

const ImageCropper = ({ updateImage, imageUrl=null }) => {
    const classes = useStyles();
    const [imageSrc, setImageSrc] = useState(imageUrl);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onConfirmImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            );
            setCroppedImage(croppedImage);
            setIsConfirmed(true);
            updateImage(croppedImage);
        } catch (e) {
            console.error(e);
        }
    }, [imageSrc, croppedAreaPixels, rotation]);

    // const onClosePreview = useCallback(() => {
    //     setCroppedImage(null);
    //     setIsConfirmed(false);
    // }, []);

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            let imageDataUrl = await readFile(file);

            const orientation = await getOrientation(file);
            const rotation = ORIENTATION_TO_ANGLE[orientation];
            if (rotation) {
                imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
            }

            setImageSrc(imageDataUrl);
        }
    };

    const renderSelectFile = () => {
        return (
            <Button variant="outlined" component="label" startIcon={<FileUploadIcon/>}>
                Upload Image
                <input type="file" onChange={onFileChange} accept="image/*" hidden />
            </Button>
        );
    };

    const renderImageCrop = () => {
        return (
            <div className={classes.mt2}>
                <div className={classes.cropContainer}>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        rotation={rotation}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>
                <div className={classes.controls}>
                    <div className={classes.sliderContainer}>
                        <Typography variant="overline" classes={{ root: classes.sliderLabel }}>
                            Zoom
                        </Typography>
                        <Slider
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            classes={{ root: classes.slider }}
                            onChange={(e, zoom) => setZoom(zoom)}
                        />
                    </div>
                    <div className={classes.sliderContainer}>
                        <Typography variant="overline" classes={{ root: classes.sliderLabel }} >
                            Rotation
                        </Typography>
                        <Slider
                            value={rotation}
                            min={0}
                            max={360}
                            step={1}
                            aria-labelledby="Rotation"
                            classes={{ root: classes.slider }}
                            onChange={(e, rotation) => setRotation(rotation)}
                        />
                    </div>
                    <Button
                        onClick={onConfirmImage}
                        variant="contained"
                        color="primary"
                        classes={{ root: classes.cropButton }}
                    >
                        Confirm Image
                    </Button>
                </div>
            </div>
        );
    };

    const renderImagePreview = () => {
        return (
            <div className={classes.imgContainer}>
                <img src={croppedImage} alt="Cropped" className={classes.img} />
            </div>
        );
    };

    return (
        <Grid item xs={12}>
            {renderSelectFile()}
            {imageSrc && renderImageCrop()}
            {imageSrc && isConfirmed && renderImagePreview()}
        </Grid>
    );
}

export default ImageCropper;