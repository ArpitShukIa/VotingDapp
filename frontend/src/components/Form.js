import {useEffect, useState} from "react";

export const Form = ({candidates, vote}) => {

    const [selectedCandidate, setSelectedCandidate] = useState(0)

    useEffect(() => {
        if (candidates.length > 0)
            setSelectedCandidate(candidates[0].id)
    }, [candidates])

    const handleDropdownSelection = (e) => {
        setSelectedCandidate(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        vote(selectedCandidate)
    }

    return (
        <form onSubmit={handleSubmit}>
            <br/>
            <div className="form-group">
                <label><b>Select Candidate</b></label>
                <select
                    className="form-control mt-1"
                    value={selectedCandidate}
                    onChange={handleDropdownSelection}
                >
                    {
                        candidates.map(candidate =>
                            <option
                                value={candidate.id}
                                key={candidate.id}
                            >
                                {candidate.name}
                            </option>
                        )
                    }
                </select>
            </div>
            <button type="submit" className="btn btn-primary mt-2">Vote</button>
            <hr/>
        </form>
    )
}
