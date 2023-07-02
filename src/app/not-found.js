import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="-mt-48 text-2xl space-y-2">
                <p>Whoops, your not meant to be here!</p>
                <div className="flex justify-end items-center gap-2">
                    <div className="hover:animate-bounce cursor-pointer">
                        <Link href="/">Return</Link>
                    </div>
                    <div> to the Photobooth</div>
                </div>
            </div>
        </div>
    )
}
