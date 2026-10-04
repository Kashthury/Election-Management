import { usePagination } from "../../hooks/usePagination";
import Pagination from "../common/Pagination";

export default function VoteEntryTable({ candidates, votes, onChange }) {
  const { pageItems, pagination } = usePagination(candidates);
  const startIndex = pagination ? (pagination.page - 1) * pagination.pageSize : 0;
  return <><div className="table-scroll"><table className="data-table"><thead><tr><th>#</th><th>Candidate</th><th>Votes</th></tr></thead>
    <tbody>{pageItems.map((candidate, index) => { const i = startIndex + index; return <tr key={candidate.id}><td>{i+1}</td><td><strong>{candidate.name}</strong></td><td><input className="input vote-input" type="number" min="0" value={votes[i] ?? 0} onChange={e => onChange(i, e.target.value)}/></td></tr>; })}</tbody>
  </table></div>
  <Pagination {...(pagination || {page:1,pageCount:1,total:candidates.length,pageSize:10,setPage:()=>{}})} />
  </>;
}
