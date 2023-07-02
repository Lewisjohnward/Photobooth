
const refreshPage = () => {
    window.location.reload(false)
}

export default function Header() {
    return (
        <div className="flex pl-24 bg-gray-400 py-2 shadow">
            <div 
                onClick={refreshPage}
                className="cursor-pointer">
                <h1 className="text-2xl text-white font-bold">Photobooth</h1>
            </div>
        </div>
    )
}
