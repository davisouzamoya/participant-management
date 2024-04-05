import { ComponentProps } from "react";

interface NavLinkPropos extends ComponentProps<'a'>{
    children:string
}

export function NavLink(props: NavLinkPropos){
    return (
        <a {...props} className='font-medium text-sm text-zinc-300'>
            {props.children}
        </a>
    )
}