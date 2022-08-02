export const Table = ({candidates}) => {
    return (
        <table className="table">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Votes</th>
            </tr>
            </thead>
            <tbody>
            {
                candidates.map(candidate =>
                    <tr key={candidate.id}>
                        <th>{candidate.id}</th>
                        <td>{candidate.name}</td>
                        <td>{candidate.voteCount}</td>
                    </tr>
                )
            }
            </tbody>
        </table>
    )
}