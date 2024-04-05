import days from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from 'lucide-react'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'

import { ChangeEvent, useEffect, useState } from 'react'


days.extend(relativeTime)
days.locale('pt-br')

interface Attendees{
    id: string;
    name: string;
    email: string;
    createdAt: string;
    checkedInAt: string | null;
}

export function AttendeeList(){
    const [seach,setSeach] = useState(() =>{
        const url = new URL(window.location.toString())

        if(url.searchParams.has('seach')){
            return url.searchParams.get('seach') ?? ''
        }

        return ''
    }
    )
    const [page,setpage] = useState(() =>{
        const url = new URL(window.location.toString())

        if(url.searchParams.has('page')){
            return Number(url.searchParams.get('page'))
        }

        return 1
    })
    const [total,setTotal] = useState(0)
    const [attendess,setAttendess] = useState<Attendees[]>([])

    const totalPages = Math.ceil(total / 10)

    useEffect(() => {
        const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')

        url.searchParams.set('pageIndex', String(page -1))

        if(seach.length > 0) url.searchParams.set('query', seach)

        fetch(url)
        .then(response => response.json())
        .then(data =>{
            setAttendess(data.attendees)
            setTotal(data.total)
        })
    },[page,seach])

    function setCurrentSeach(seach: string){
        const url = new URL(window.location.toString())

        url.searchParams.set('seach',seach)

        window.history.pushState({},"",url)
        setSeach(seach)
    }

    function setCurrentPage(page: number){
        const url = new URL(window.location.toString())

        url.searchParams.set('page',String(page))

        window.history.pushState({},"",url)
        setpage(page)
    }

    function onSeachInputChange(event: ChangeEvent<HTMLInputElement>){
        setCurrentSeach(event.target.value)
        setCurrentPage(1)
    }

    function goToFirstPage(){
        setCurrentPage(1)
    }

    function goToLastPage(){
        setCurrentPage(totalPages)
    }

    function goToPreviousPage(){
        setCurrentPage(page - 1 )
    }

    function goToNextPage(){
        setCurrentPage(page + 1 )
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-3 items-center'>
                <h1 className='text-2xl font-bold'>Participantes</h1>
                <div className='px-3 w-72 py-1.5 border border-white/10 rounded-lg text-sm flex items-center gap-3'>
                    <Search className='size-4 text-emerald-300' />
                    <input 
                        value={seach}
                        onChange={onSeachInputChange} 
                        className='bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0' 
                        placeholder='Buscar participantes...' />
                </div>
            </div>

           <Table>
                <thead>
                    <tr className='border-b border-white/10'>
                        <TableHeader style={{ width: 48 }} >
                            <input type="checkbox" className='size-4 bg-black/20 rounded border border/10'/>
                        </TableHeader>
                        <TableHeader >
                            Código
                        </TableHeader>
                        <TableHeader >
                            Participantes
                        </TableHeader>
                        <TableHeader >
                            Data da Inscrição
                        </TableHeader>
                        <TableHeader >Data do Check-in</TableHeader>
                        <TableHeader style={{ width: 64 }} ></TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {attendess.map((attendee) => {
                        return (
                            <TableRow key={attendee.id} className='border-b border-white/10 hover:bg-white/5'>
                            <TableCell>
                                <input type="checkbox" className='size-4 bg-black/20 rounded border border/10'/>
                            </TableCell>
                            <TableCell>{attendee.id}</TableCell>
                            <TableCell>
                                <div className='flex flex-col gap-1'>
                                    <span className='font-semibold text-white'>{attendee.name}</span>
                                    <span>{attendee.email}</span>
                                </div>
                            </TableCell>
                            <TableCell>{days().to(attendee.createdAt)}</TableCell>
                            <TableCell>{attendee.checkedInAt == null 
                                ? <span className='text-zinc-400'>Não Fez Check-in</span> 
                                : days().to(attendee.checkedInAt)}</TableCell>
                            <TableCell>
                                <IconButton transparent>
                                    <MoreHorizontal className='size-4'/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                        )
                    })}
                    
                </tbody>
                <tfoot>
                    <tr>
                        <td className="py-3 px-4 text-sm text-zinc-300" colSpan={3}>
                            Mostrando {attendess.length} de {total} itens
                        </td>
                        <TableCell className="text-right" colSpan={3}>
                            <div className='inline-flex items-center gap-8'>
                                <span>Página {page} de {totalPages}</span>

                                <div className='flex gap-1.5'>
                                    <IconButton onClick={goToFirstPage} disabled={page == 1}>
                                        <ChevronsLeft className='size-4'/>
                                    </IconButton>
                                    <IconButton onClick={goToPreviousPage} disabled={page == 1}>
                                        <ChevronLeft className='size-4'/>
                                    </IconButton>
                                    <IconButton onClick={goToNextPage} disabled={page == totalPages}>
                                        <ChevronRight className='size-4'/>
                                    </IconButton>
                                    <IconButton onClick={goToLastPage} >
                                        <ChevronsRight className='size-4'/>
                                    </IconButton>
                                </div>
                                

                                
                            </div>
                        </TableCell>
                    </tr>
                </tfoot>
            </Table>
        </div>
    )
}