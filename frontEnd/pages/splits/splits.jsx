import { useState, useEffect } from "react";
import axios from "axios";
import "./splits.css";

export default function Splits() {
    const API=process.env.REACT_APP_API
  const API_URL = `${ API }/api/splits`;
  const USERS_URL = `${ API }/api/auth/users`;

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const [dbSettlements, setDbSettlements] = useState([]);

  const [crew, setCrew] = useState([
    { id: "1", username: "Ayushi Adhikari", paid: 1200, share: 0 },
    { id: "2", username: "Riddhi Singh", paid: 700, share: 0 },
  ]);
  const [splitEqually, setSplitEqually] = useState(true);
  const [settlements, setSettlements] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // all registered users
  // calculate settlements dynamically for user-entered crew


  // fetch all splits + settlements for the logged-in user
  useEffect(() => {
  if (!token || allUsers.length === 0) return;

  const fetchUserSettlements = async () => {
    try {
      const { data: splits } = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allSettlements = splits.flatMap(split =>
        (split.settlements || []).map(s => ({
          ...s,
          splitTitle: split.title,
          from: allUsers.find(u => u._id === s.from)?.name || s.from,
          to: allUsers.find(u => u._id === s.to)?.name || s.to,
        }))
      );

      setDbSettlements(allSettlements);
    } catch (err) {
      console.error("Error fetching settlements from DB:", err);
    }
  };

  fetchUserSettlements();
}, [token, allUsers]);

  // fetch all users to resolve usernames â IDs
  useEffect(() => {
    if (!token) return;
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(USERS_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [token]);

  const totalPaid = crew.reduce((sum, m) => sum + m.paid, 0);
  const totalShare = crew.reduce((sum, m) => sum + m.share, 0);

  // calculate shares
  useEffect(() => {
    if (splitEqually && crew.length > 0) {
      const sharePerPerson = totalPaid / crew.length;
      setCrew(prev => prev.map(m => ({ ...m, share: sharePerPerson })));
    }
  }, [splitEqually, totalPaid, crew.length]);
  useEffect(() => {
  if (!crew || crew.length === 0) return;

  const newSettlements = [];
  const balances = crew.map(m => ({ name: m.username, balance: m.paid - m.share }));
  const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
  const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);

  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    const amount = Math.min(creditor.balance, -debtor.balance);
    if (amount > 0.01) newSettlements.push({ from: debtor.name, to: creditor.name, amount: Math.round(amount) });
    creditor.balance -= amount;
    debtor.balance += amount;
    if (creditor.balance < 0.01) i++;
    if (debtor.balance > -0.01) j++;
  }

  setSettlements(newSettlements);
}, [crew, splitEqually, totalPaid, totalShare]);

  async function saveSplit() {
    if (!token) {
      alert("Please log in first!");
      return;
    }

    // Resolve usernames to IDs
    const participantIds = [];
    for (const member of crew) {
      const user = allUsers.find(u => u.name === member.username);
      if (!user) {
        alert(`User "${member.username}" not found!`);
        return;
      }
      participantIds.push(user._id);
    }

    // Prepare transactions from calculated settlements
    const transactions = settlements.map(s => {
      const fromUser = allUsers.find(u => u.name === s.from)?._id;
      const toUser = allUsers.find(u => u.name === s.to)?._id;
      if (!fromUser || !toUser) return null;
      return { from: fromUser, to: toUser, amount: s.amount };
    }).filter(Boolean);

    try {
      // 1ï¸â£ Create Split first
      const splitPayload = {
        title: "Crew Expenses",
        participants: participantIds,
        mode: splitEqually ? "equal" : "custom",
        transactions,
      };

      const { data: splitData } = await axios.post(API_URL, splitPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!splitData || !splitData._id) {
  alert("Error: Split creation failed, cannot record settlements.");
  return;
}
console.log(splitData)

      
      alert("Split & Settlements saved successfully!");
      console.log("Saved split:", splitData);
    } catch (err) {
      console.error("Error saving split:", err.response?.data || err);
      alert("Failed to save split. Check console for details.");
    }
  }



  function addCrewMember() {
    const newId = (crew.length + 1).toString();
    setCrew(prev => [...prev, { id: newId, username: "", paid: 0, share: 0 }]);
  }

  function removeCrewMember(id) {
    setCrew(prev => prev.filter(m => m.id !== id));
  }

  function updateCrewMember(id, field, value) {
    setCrew(prev => prev.map(m => (m.id === id ? { ...m, [field]: value } : m)));
  }

  function resetForm() {
    setCrew([
      { id: "1", username: "Asha", paid: 0, share: 0 },
      { id: "2", username: "Ravi", paid: 0, share: 0 },
    ]);
    setSplitEqually(true);
  }
  async function handleDeleteSettlement(settlement) {
  if (!settlement.settled) return; // safety check

  try {
    await axios.delete(`${API_URL}/${settlement._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setDbSettlements(prev => prev.filter(s => s._id !== settlement._id));
  } catch (err) {
    console.error("Error deleting settlement:", err);
    alert("Failed to delete settlement");
  }
}
async function handleSettleSettlement(settlement) {
  if (settlement.settled) return; // already settled

  try {
    await axios.patch(`${API_URL}/${settlement._id}/settle`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Only update settled flag locally
    setDbSettlements(prev =>
      prev.map(s => s._id === settlement._id ? { ...s, settled: true } : s)
    );
    // Check if all settlements for the same splitId are settled
    const splitId = settlement.splitId;
    const remaining = dbSettlements.filter(
      s => s.splitId === splitId && !s.settled && s._id !== settlement._id
    );

    if (remaining.length === 0) {
      // â All settled, generate Split Card
      
      

      await axios.post(
        "http://localhost:3000/api/cards",
        {
          userId: userInfo._id,        // current user
          kind: "split",               // important!
          title: `Split Completed`,
          subtitle: `All crew members settled split "${settlement.splitTitle}"`,
          value: settlement.amount,    // optional, total maybe sum?
          level: 1,
          progress: 100,
          icon: "ðª",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

  } catch (err) {
    console.error("Error settling settlement:", err);
    alert("Failed to mark settlement as settled");
  }
}


  return (
    <div className="payments-container">
      <div className="payments-inner">
        <Header />
        <div className="grid-container">
          <CrewExpenses
            crew={crew}
            splitEqually={splitEqually}
            setSplitEqually={setSplitEqually}
            updateCrewMember={updateCrewMember}
            removeCrewMember={removeCrewMember}
            addCrewMember={addCrewMember}
            resetForm={resetForm}
            totalPaid={totalPaid}
            totalShare={totalShare}
            saveSplit={saveSplit}
          />
          <div className="payments-container">
      <div className="payments-inner">
        <h1>Splits Preview</h1>
        <SettlementPreview settlements={settlements} />
        <h1>My Settlements</h1>
        <SettlementCards settlements={dbSettlements} onDelete={handleDeleteSettlement}
  onSettle={handleSettleSettlement} />
      </div>
    </div>
        </div>
      </div>
    </div>
  );
}

/* Header Component */
function Header() {
  return (
    <div className="header">
      <h1>Payments & Splits</h1>
      <p>Settle your crew's dues and mint Split Cards. This is a simulated flow for MVP.</p>
    </div>
  )
}

/* Crew Expenses */
function CrewExpenses({
  crew,
  splitEqually,
  setSplitEqually,
  updateCrewMember,
  removeCrewMember,
  addCrewMember,
  resetForm,
  totalPaid,
  totalShare,
  saveSplit
}) {
  return (
    <div className="crew-card">
      <h2>Crew & Expenses</h2>
      <p>Enter how much each crew member paid. Choose equal split or specify each share.</p>

      <SplitEquallyCheckbox splitEqually={splitEqually} setSplitEqually={setSplitEqually} />
      <CrewTable
        crew={crew}
        splitEqually={splitEqually}
        updateCrewMember={updateCrewMember}
        removeCrewMember={removeCrewMember}
      />
      <ActionButtons addCrewMember={addCrewMember} resetForm={resetForm} saveSplit={saveSplit} />
      <Totals totalPaid={totalPaid} totalShare={totalShare} />
    </div>
  )
}

function SplitEquallyCheckbox({ splitEqually, setSplitEqually }) {
  return (
    <div className="split-equally">
      <input
        type="checkbox"
        id="split-equally"
        checked={splitEqually}
        onChange={(e) => setSplitEqually(e.target.checked)}
      />
      <label htmlFor="split-equally">Split equally</label>
    </div>
  )
}

function CrewTable({ crew, splitEqually, updateCrewMember, removeCrewMember }) {
  return (
    <div className="crew-table">
      <div className="crew-table-header">
        <div>Name</div>
        <div>Paid (â¹)</div>
        <div>Share (â¹) â¢ auto</div>
        <div></div>
      </div>

      {crew.map((member) => (
        <CrewRow
          key={member.id}
          member={member}
          splitEqually={splitEqually}
          updateCrewMember={updateCrewMember}
          removeCrewMember={removeCrewMember}
          canRemove={crew.length > 1}
        />
      ))}
    </div>
  )
}

function CrewRow({ member, splitEqually, updateCrewMember, removeCrewMember, canRemove }) {
  return (
    <div className="crew-row">
      {/* Username input */}
      <input
        type="text"
        value={member.username}   // â use username instead of name
        onChange={(e) => updateCrewMember(member.id, "username", e.target.value)}
        placeholder="Username"
      />
      <input
        type="number"
        value={member.paid}
        onChange={(e) => updateCrewMember(member.id, "paid", Number.parseFloat(e.target.value) || 0)}
      />
      <input
        type="number"
        value={member.share.toFixed(2)}
        onChange={(e) => !splitEqually && updateCrewMember(member.id, "share", Number.parseFloat(e.target.value) || 0)}
        disabled={splitEqually}
      />
      {canRemove && <button onClick={() => removeCrewMember(member.id)}>Ã</button>}
    </div>
  )
}


function ActionButtons({ addCrewMember, resetForm , saveSplit}) {
  return (
    <div className="action-buttons">
      <button className="add-button" onClick={addCrewMember}>Add Crew</button>
      <button className="reset-button" onClick={resetForm}>Reset</button>
      <button className="save-button" onClick={saveSplit}>Save Split</button>
    </div>
  )
}

function Totals({ totalPaid, totalShare }) {
  return (
    <div className="totals">
      <span>Total Paid: <span className="amount">â¹{totalPaid.toLocaleString()}</span></span>
      <span>Total Share: <span className="amount">â¹{Math.round(totalShare).toLocaleString()}</span></span>
    </div>
  )
}

function SettlementPreview({ settlements }) {
  return (
    <div className="card">
      <h2>Splits Preview</h2>
      <p>Optimized payments from debtors to creditors. Positive balance receives; negative pays.</p>

      {settlements.length > 0 ? settlements.map((settlement, index) => <SettlementItem key={index} settlement={settlement} />)
        : <p style={{ color: "#94a3b8", fontStyle: "italic" }}>No settlements needed</p>}
    </div>
  )
}

function SettlementItem({ settlement }) {
  return (
    <div className="settlement-item">
      <span>{settlement.from} pays {settlement.to}</span>
      <span className="amount">â¹{settlement.amount}</span>
    </div>
  )
}
function SettlementCards({ settlements, onDelete, onSettle }) {
  return (
    <div className="card">
      <h2>Settlement Cards</h2>
      {settlements.length > 0 ? settlements.map((s, idx) => (
        <SettlementCard
          key={idx}
          settlement={s}
          onDelete={onDelete}
          onSettle={onSettle}
        />
      )) : (
        <p style={{ color: "#94a3b8", fontStyle: "italic" }}>No settlements found</p>
      )}
    </div>
  )
}

function SettlementCard({ settlement, onDelete, onSettle }) {
  const fromName = settlement.from?.name || settlement.from;
  const toName = settlement.to?.name || settlement.to;
  const date = settlement.createdAt ? new Date(settlement.createdAt).toLocaleDateString() : "Unknown date";

  return (
    <div className="split-card">
      <div className="split-card-header">
        <div className="date">{date}</div>
        <div className={`status-box ${settlement.settled ? "settled" : "unsettled"}`}></div>
      </div>
      <div className="split-card-content">
        <h3>{fromName} â {toName}</h3>
        <p>Split: {settlement.splitTitle || "N/A"}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
          <span className="amount">â¹{settlement.amount}</span>
          <span>{settlement.settled ? "â Settled" : "â³ Unsettled"}</span>
          {!settlement.settled && <button onClick={() => onSettle(settlement)}>Settle</button>}
          {settlement.settled && <button onClick={() => onDelete(settlement)}>Delete</button>}
        </div>
      </div>
    </div>
  )
}


