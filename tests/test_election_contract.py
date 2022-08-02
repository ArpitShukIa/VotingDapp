from scripts.deploy_election_contract import deploy_contract
from scripts.helpful_scripts import get_account
from brownie import exceptions
import pytest


def test_candidates_initialized():
    election_contract = deploy_contract()
    assert election_contract.candidateCount() == 2
    assert election_contract.candidates(1) == (1, "Candidate 1", 0)
    assert election_contract.candidates(2) == (2, "Candidate 2", 0)


def test_vote_is_casted():
    account = get_account()
    election_contract = deploy_contract()
    tx = election_contract.vote(1, {"from": account})
    assert election_contract.candidates(1)[2] == 1
    assert tx.events["votedEvent"]["candidateId"] == 1


def test_voter_cannot_vote_twice():
    account = get_account()
    election_contract = deploy_contract()
    election_contract.vote(1, {"from": account})
    with pytest.raises(exceptions.VirtualMachineError):
        election_contract.vote(2, {"from": account})

    # ensure contract is unaltered
    assert election_contract.candidates(1)[2] == 1
    assert election_contract.candidates(2)[2] == 0


def test_cannot_vote_invalid_candidate():
    account = get_account()
    election_contract = deploy_contract()
    with pytest.raises(exceptions.VirtualMachineError):
        election_contract.vote(3, {"from": account})
