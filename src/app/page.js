'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import { AiFillSave, AiFillDelete, AiFillCamera, AiOutlineArrowUp } from 'react-icons/ai'
import { BiSolidChevronRight, BiSolidChevronLeft } from 'react-icons/bi'
import { IoSettings } from 'react-icons/io5'
import Header from './components/header'
import Button from './components/button'
import Modal from './components/modal'

export default function Home() {
    const [cameraOn, setCameraOn] = useState(false)
    return (
        <>
            <Header />
            { cameraOn ?  
                <Camera /> : 
                <LandingPage setCameraOn={setCameraOn}/> 
            }
        </>
    )
}

const Camera = () => {
    const [cameraActive, setCameraActive] = useState(false)


    return (
        <div className="flex flex-col items-center gap-6 flex-grow bg-black/80 text-white">
            {cameraActive ?
                <CameraView />
                :
                <TermsAndConditions setCameraActive={setCameraActive}/>
            }
        </div>
    )
}

const effects = ["normal", "grayscale", "sepia", "inverted", "hue", "blur", "contrast"]

const CameraView = () => {
    const [error, setError] = useState(false)
    const [webcamAccepted, setWebcamAccepted] = useState(false)
    const [photoTaken, setPhotoTaken] = useState(false)
    const [effectPos, setEffectPos] = useState(0)
    const [effect, setEffect] = useState(effects[effectPos])

    const videoRef = useRef()
    const canvasRef = useRef()

    async function getMedia() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: false, video: true})
            setWebcamAccepted(true)
            videoRef.current.srcObject = stream
            videoRef.current.play()
        } catch(err) {
            setError(true)
            console.log(err)
        }
    }

    const changeEffect = (pos) => {
        const newPos = 
            effectPos + pos < 0 ?
            effects.length - 1 : 
            effectPos + pos > effects.length - 1 ?
            0 : effectPos + pos

        setEffectPos(newPos)
        setEffect(effects[newPos])
    }

    useEffect(() => {
        getMedia()
    }, [])

    return (
        <>
            <div 
                className={clsx("flex justify-center items-center gap-2 mt-36 font-bold text-2xl animate-bounce", webcamAccepted && "hidden")}>
                <AiOutlineArrowUp />
                <p>Allow access from the menu above</p>
                <AiOutlineArrowUp />
            </div>
            <Video 
                setPhotoTaken={setPhotoTaken} 
                photoTaken={photoTaken} 
                webcamAccepted={webcamAccepted}
                videoRef={videoRef}
                effect={effect}
                changeEffect={changeEffect}
            />
            {photoTaken && <Photo videoRef={videoRef} setPhotoTaken={setPhotoTaken}/>}
        </>
    )
}
//videoRef.current.style.filter = "grayscale(100%)"
//<option value="none">Normal</option>
//<option value="grayscale(100%)">Grayscale</option>
//<option value="sepia(100%)">Sepia</option>
//<option value="invert(100%)">Invert</option>
//<option value="hue-rotate(90deg)">Hue</option>
//<option value="blur(10px)">Blur</option>
//<option value="contrast(200%)">Contrast</option>


const Video = ({photoTaken, setPhotoTaken, webcamAccepted, videoRef, effect, changeEffect}) => {
    const [settingsVisible, setSettingsVisible] = useState(false)
    return (
        <div 
            className={clsx("relative mt-16", (photoTaken || !webcamAccepted) && "hidden")}
        >
            <video 
                width={"1000px"}
                ref={videoRef}
            />
            <div className="relative -mt-6 w-full flex justify-center items-center gap-4 [&_*]:text-2xl">
                <div className="relative flex justify-center">
                    {settingsVisible && <Settings />}
                    <Button
                         onClick={() => setSettingsVisible(prev => !prev)}
                    >
                        <IoSettings/>
                    </Button>
                </div>
                <Button
                    onClick={() => changeEffect(-1)}
                >
                    <BiSolidChevronLeft />
                </Button>
                <Button
                    styles={"w-48 flex justify-center"}
                >
                    {effect}
                </Button>
                <Button
                    onClick={() => changeEffect(1)}
                >
                    <BiSolidChevronRight />
                </Button>
                <Button onClick={() => setPhotoTaken(true)} >
                    <AiFillCamera />
                </Button>
            </div>
        </div>
    )
}
const Settings = ()  => {
    return (
        <div className="absolute -top-48 p-4 bg-black [&_*]:text-xl [&>*]:flex [&>*]:items-center [&>*]:gap-4">
            <div>
                <input id="mirrorCheckbox" type="checkbox" />
                <label htmlFor="mirrorCheckbox"> Mirror </label>
            </div>
            <div>
                <div className="bg-white w-4 h-4" />
                Square
            </div>
            <div>
                <div className="bg-white w-4 h-4" />
                Countdown
            </div>
            <div>
                <div className="bg-white w-4 h-4" />
                Fullscreen
            </div>
            <div>
                <div className="bg-white w-4 h-4" />
                Flash
            </div>
            <div className="absolute -bottom-2 left-1/2 bg-black -translate-x-1/2 rotate-45 w-4 h-4" />
        </div>
    )
}

const Photo = ({videoRef, setPhotoTaken}) => {
    const canvasRef = useRef()

    const takePhoto = () => {
        const width = 1000//videoRef.current.videoWidth
        const height = 750//videoRef.current.videoHeight
        canvasRef.current.width = width
        canvasRef.current.height = height
        canvasRef.current.getContext('2d').drawImage(videoRef.current, 0, 0, width, height)
    }

    const savePhoto = async (event) => {
        let date = new Date().toISOString()
        console.log(date)
        date = date.replace(/[\s:\.TZ-]/g, "")
        const link = event.currentTarget
        console.log(date)
        link.setAttribute('download', `photobooth-${date}.png`)
        const image = canvasRef.current.toDataURL('image/png')
        link.setAttribute('href', image)
    }


    useEffect(() => {
        setTimeout(() => takePhoto(), 200)
    },[])


    return (
        <Modal>
            <div 
                className="absolute top-0 left-0 h-full w-screen flex flex-col justify-center items-center bg-black/60"
            >
                <div className="flex flex-col items-center">
                    <canvas 
                        ref={canvasRef} 
                        width={"1000px"}
                    />
                    <div className="flex gap-4">
                        <a onClick={savePhoto} >
                            <Button styles={"-mt-6"} >
                                <AiFillSave className="text-2xl" />
                            </Button>
                        </a>
                        <Button styles={"-mt-6"} onClick={() => setPhotoTaken(false)} >
                            <AiFillDelete className="text-2xl" />
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

const TermsAndConditions = ({setCameraActive}) => {
    return (
        <div className="w-full md:w-2/6 px-4 md:px-0 mt-48 space-y-6 flex flex-col items-center text-center">
            <p className="font-bold">Press the button to access your camera</p>
            <Button 
                onClick={() => setCameraActive(true)}
            >Use my camera</Button>
            <p>Photos are <span className="font-bold underline">not</span> stored online unless you choose to share them.</p>
            <p>Photobooth uses cookies for traffic analysis, ads measurement purposes, and to show non-personalized ads. By continuing, you consent to the <span className="underline font-bold">cookie policy</span> and <span className="underline font-bold">Google's policy</span></p>
        </div>
    )
}

const LandingPage = ({setCameraOn}) => {
    return (
        <>
            <div className="mt-48 text-center space-y-2">
                <p className="font-bold">Photobooth</p>
                <p>Take pictures with several fun effects!</p>
            </div>
            <div className="flex justify-center mt-4">
                <Button 
                    onClick={() => setCameraOn(true)}
                >Ready? Smile! <AiFillCamera className="text-2xl"/></Button>
            </div>
            <div className="fixed bottom-0 w-full flex justify-center gap-8 mb-2 text-sm">
                <Link href="#">Terms of Service</Link>
                <Link href="#">Privacy Policy</Link>
                <Link href="#">Language</Link>
            </div>
        </>
    )
}

