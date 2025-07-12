import React, { useEffect, useState } from "react";
import axios from "axios";

const SAFE_ADDRESS = process.env.REACT_APP_SAFE_ADDRESS;
const ARBITRUM_API_KEY = process.env.REACT_APP_ARBISCAN_API_KEY;
const GITHUB_REPO = process.env.REACT_APP_GITHUB_REPO; // e.g. thegoodeth12/Safe-bot
const SLACK_WEBHOOK_URL = process.env.REACT_APP_SLACK_WEBHOOK;

export default function SafeDashboard() {
  const [txns, setTxns] = useState([]);
  const [repoStatus, setRepoStatus] = useState({});
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (!SAFE_ADDRESS || !ARBITRUM_API_KEY) return;
    axios
      .get(
        `https://api.arbiscan.io/api?module=account&action=txlist&address=${SAFE_ADDRESS}&sort=desc&apikey=${ARBITRUM_API_KEY}`
      )
      .then((res) => {
        if (res.data.status === "1") {
          setTxns(res.data.result.slice(0, 10));
        }
      })
      .catch(() => setTxns([]));
  }, []);

  useEffect(() => {
    if (!GITHUB_REPO) return;
    axios
      .get(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then((res) => {
        setRepoStatus({
          stars: res.data.stargazers_count,
          forks: res.data.forks_count,
          issues: res.data.open_issues_count,
        });
      })
      .catch(() => setRepoStatus({}));
  }, []);

  useEffect(() => {
    if (!SAFE_ADDRESS || !ARBITRUM_API_KEY) return;
    const fetchBalance = async () => {
      try {
        const res = await axios.get(
          `https://api.arbiscan.io/api?module=account&action=balance&address=${SAFE_ADDRESS}&apikey=${ARBITRUM_API_KEY}`
        );
        if (res.data.status === "1") {
          setBalance((parseInt(res.data.result) / 1e18).toFixed(4));
        }
      } catch {
        setBalance(null);
      }
    };
    fetchBalance();
  }, []);

  const sendSlackAlert = async (message) => {
    if (!SLACK_WEBHOOK_URL) {
      alert("Slack webhook URL not set.");
      return;
    }
    try {
      await axios.post(SLACK_WEBHOOK_URL, {
        text: `🔐 Safe Wallet Alert\n\n${message}`,
      });
      alert("✅ Slack alert sent!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send Slack alert.");
    }
  };

  return (
    <div
      style={{
        fontFamily: "monospace",
        padding: 20,
        maxWidth: 700,
        margin: "auto",
      }}
    >
      <h1>Safe Wallet Dashboard</h1>
      <p>
        <b>Safe Address:</b> {SAFE_ADDRESS}
      </p>
      <p>
        <b>ETH Balance:</b> {balance !== null ? `${balance} ETH` : "Loading..."}
      </p>

      <h2>Latest Transactions</h2>
      {txns.length === 0 && <p>No transactions found.</p>}
      <ul>
        {txns.map((txn) => (
          <li key={txn.hash}>
            <a
              href={`https://arbiscan.io/tx/${txn.hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {txn.hash.substring(0, 10)}... - {(txn.value / 1e18).toFixed(4)} ETH -{" "}
              {txn.isError === "0" ? "✅ Success" : "❌ Fail"}
            </a>
          </li>
        ))}
      </ul>

      <h2>GitHub Repo Status</h2>
      <ul>
        <li>⭐ Stars: {repoStatus.stars ?? "Loading..."}</li>
        <li>🍴 Forks: {repoStatus.forks ?? "Loading..."}</li>
        <li>🐛 Open Issues: {repoStatus.issues ?? "Loading..."}</li>
      </ul>

      <button
        onClick={() =>
          sendSlackAlert(
            `Dashboard check for Safe Wallet ${SAFE_ADDRESS} at ${new Date().toLocaleTimeString()}`
          )
        }
        style={{ padding: "10px 20px", cursor: "pointer", marginTop: 20 }}
      >
        Send Test Slack Alert
      </button>
    </div>
  );
}
