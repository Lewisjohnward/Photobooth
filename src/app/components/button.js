import clsx from 'clsx'

export default function Button({children, onClick, styles}) {
    return (
        <div 
            onClick={onClick}
            className={clsx("flex items-center h-16 bg-green-500 text-white font-bold rounded py-4 px-8 cursor-pointer shadow-xl flex gap-4 hover:scale-95 active:shadow-sm active:bg-green-700", styles)}
        >
            {children}
        </div>
    )
}
