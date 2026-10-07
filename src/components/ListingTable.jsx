import { useMemo, useState } from 'react'
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ExternalLink, Heart, MapPin } from 'lucide-react'
import clsx from 'clsx'
import FitBadge from './FitBadge'
import { VATS, priceText, sizeText } from '../lib/constants'

export default function ListingTable({ rows, fav, onFav, onMap }) {
  const [sorting, setSorting] = useState([])
  const columns = useMemo(
    () => [
      { id: 'fav', header: '', enableSorting: false, cell: ({ row }) => (
        <button onClick={() => onFav(row.original.i)} aria-label="Favourite" className={clsx('grid h-7 w-7 place-items-center rounded-md hover:bg-panel2', fav.has(row.original.i) ? 'text-bad' : 'text-muted')}>
          <Heart size={15} fill={fav.has(row.original.i) ? 'currentColor' : 'none'} />
        </button>) },
      { accessorKey: 'dev', header: 'Developer' },
      { accessorKey: 'pr', header: 'Programme', cell: (c) => <b className="font-semibold">{c.getValue()}</b> },
      { accessorKey: 'c', header: 'Town' },
      { accessorKey: 'dp', header: 'Dept' },
      { id: 'size', header: 'Size', accessorFn: (r) => r.s2 || r.s1 || 0, cell: ({ row }) => sizeText(row.original) },
      { id: 'price', header: 'Price', accessorFn: (r) => r.p1 ?? 1e9, cell: ({ row }) => <b className="tabular-nums">{priceText(row.original).main}</b> },
      { id: 'ppm', header: '€/m²', accessorFn: (r) => r.ppm ?? 1e9, cell: ({ row }) => (row.original.ppm ? row.original.ppm.toLocaleString('fr-FR') : '') },
      { id: 'vat', header: 'VAT', accessorFn: (r) => VATS[r.vat] },
      { id: 'dl', header: 'Delivery', accessorFn: (r) => (r.dl || '').slice(0, 18) },
      { id: 'f', header: 'Match', accessorFn: (r) => r.f, cell: ({ row }) => <FitBadge f={row.original.f} /> },
      { id: 'go', header: '', enableSorting: false, cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.u && <a href={row.original.u} target="_blank" rel="noopener noreferrer" aria-label="Open page" className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-panel2 hover:text-ink"><ExternalLink size={15} /></a>}
          <button onClick={() => onMap(row.original)} aria-label="Show on map" className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-panel2 hover:text-ink"><MapPin size={15} /></button>
        </div>) },
    ],
    [fav, onFav, onMap],
  )
  const table = useReactTable({ data: rows, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() })
  const shown = table.getRowModel().rows.slice(0, 500)
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-panel">
      <table className="w-full min-w-[980px] border-collapse text-[13.5px]">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} onClick={h.column.getToggleSortingHandler()} className={clsx('sticky top-0 whitespace-nowrap border-b border-line bg-panel px-3 py-2.5 text-left font-medium text-muted', h.column.getCanSort() && 'cursor-pointer select-none hover:text-ink')}>
                  <span className="inline-flex items-center gap-1">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getIsSorted() === 'asc' && <ArrowUp size={13} />}
                    {h.column.getIsSorted() === 'desc' && <ArrowDown size={13} />}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {shown.map((row) => (
            <tr key={row.id} className="hover:bg-panel2">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="max-w-[260px] truncate whitespace-nowrap border-b border-line px-3 py-2">{flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.header, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 500 && <p className="m-0 p-3 text-muted">Showing the first 500 of {rows.length}. Narrow the filters to see the rest.</p>}
    </div>
  )
}
