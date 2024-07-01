import { Button } from "@/components/ui/button"

export const Navbar = () => {
    return (
        <div className="flex flex-row items-center p-4">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl text-white">daisyUI</a>
            </div>
            <div className="flex items-center space-x-6 text-white pr-1">
                <a className="cursor-pointer">Pricing</a>
                <a className="cursor-pointer">Login</a>
                <Button size="sm" className="bg-white text-black hover:bg-white">Signup</Button>
            </div>
        </div>
    )
}
