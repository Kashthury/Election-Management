import { SquarePen } from "lucide-react";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../common/Pagination";

export default function VoteEntryTable({ candidates, votes, onEditVote, showDistrict = false }) {
  const { pageItems, pagination } = usePagination(candidates);
  const startIndex = pagination ? (pagination.page - 1) * pagination.pageSize : 0;

  return <>
    <div className="table-scroll"><table className="data-table vote-entry-table">
      <thead><tr><th>#</th>{showDistrict&&<th>District</th>}<th>Party</th><th>Votes recorded</th><th className="actions-column">Action</th></tr></thead>
      <tbody>{pageItems.map((party, index) => {
        const rowIndex = startIndex + index;
        return <tr key={`${party.districtId||"selected"}-${party.id}`}>
          <td>{rowIndex + 1}</td>
          {showDistrict&&<td>{party.districtName}</td>}
          <td><strong>{party.name}</strong></td>
          <td><span className="vote-count-readonly">{Number(votes[rowIndex] ?? 0).toLocaleString()}</span></td>
          <td><div className="row-actions"><button type="button" className="row-action" aria-label={`Edit votes for ${party.name}`} title="Edit votes" onClick={() => onEditVote(party, rowIndex)}><SquarePen size={16}/></button></div></td>
        </tr>;
      })}
      {!candidates.length&&<tr><td colSpan={showDistrict?5:4} className="module-empty">No parties are registered in the selected area.</td></tr>}
      </tbody>
    </table></div>
    <Pagination {...(pagination || {page:1,pageCount:1,total:candidates.length,pageSize:10,setPage:()=>{}})} />
  </>;
}
