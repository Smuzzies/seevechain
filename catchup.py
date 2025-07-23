import sys
import requests
import psycopg2
import time

API_KEY = "105d65043d615c6c9979f76af87674e67410cf97b737004563032a3a65e08e01"
HEADERS = {"x-api-key": API_KEY}
API_BASE = "https://api.vechainstats.com/v1"

DB_CONN_STR = "dbname=seevechain user=postgres"

# --- Helper: Interactive Prompt ---
def prompt_user_step(data, summary=None):
    print("\n--- Data Fetched ---")
    if summary:
        print(summary)
    print(data)
    print("\nPress Enter to proceed and insert this data into the database.")
    print("Press 's' then Enter to skip, or 'q' then Enter to quit.")
    choice = input("> ").strip().lower()
    if choice == 'q':
        print("Quitting script.")
        sys.exit(0)
    elif choice == 's':
        print("Skipping this entry.")
        return False
    else:
        print("Proceeding with insert.")
        return True

# --- Main Catchup Logic ---
def main():
    # Connect to PostgreSQL
    try:
        conn = psycopg2.connect(DB_CONN_STR)
        cur = conn.cursor()
    except Exception as e:
        print("Error connecting to database:", e)
        sys.exit(1)

    # 1. Get latest block number from clauses table
    cur.execute("""
        SELECT MAX(t.block_number)
        FROM clauses c
        JOIN transactions t ON c.transaction_id = t.id;
    """)
    latest_block = cur.fetchone()[0] or 0
    print(f"Latest block in local DB (clauses): {latest_block}")

    # 2. Ask user for target block number to catch up to
    target_block = input("Enter the block number to catch up to (or press Enter to fetch latest from API): ").strip()
    if not target_block:
        # Fetch latest block from API
        resp = requests.get(f"{API_BASE}/blocks/latest", headers=HEADERS)
        if resp.status_code != 200:
            print("Error fetching latest block from API.")
            sys.exit(1)
        target_block = resp.json().get("number")
        print(f"Latest block on VeChain: {target_block}")
    else:
        target_block = int(target_block)

    # 3. Loop through missing blocks (API rate limited!)
    for block_num in range(latest_block + 1, target_block + 1):
        print(f"\nFetching block {block_num} from VeChainStats API...")
        url = f"{API_BASE}/block/{block_num}"
        resp = requests.get(url, headers=HEADERS)
        if resp.status_code != 200:
            print(f"Error fetching block {block_num}: {resp.status_code}")
            continue
        block_data = resp.json()
        summary = f"Block {block_num}: {block_data.get('txs', 0)} transactions"
        # Show summary and full data, prompt user
        if not prompt_user_step(block_data, summary=summary):
            continue
        # 4. Insert transactions and clauses (example, adjust to your schema)
        txs = block_data.get('transactions', [])
        for tx in txs:
            # Insert transaction (simplified, adjust columns as needed)
            try:
                cur.execute("""
                    INSERT INTO transactions (id, block_number, origin, created_at)
                    VALUES (%s, %s, %s, to_timestamp(%s))
                    ON CONFLICT (id) DO NOTHING;
                """, (
                    tx.get('id'),
                    block_num,
                    tx.get('origin'),
                    tx.get('timestamp'),
                ))
            except Exception as e:
                print(f"Error inserting transaction {tx.get('id')}: {e}")
                conn.rollback()
                continue
            # Insert clauses (if present)
            clauses = tx.get('clauses', [])
            for clause in clauses:
                try:
                    cur.execute("""
                        INSERT INTO clauses (transaction_id, type, contract, reverted, created_at)
                        VALUES (%s, %s, %s, %s, to_timestamp(%s))
                        ON CONFLICT DO NOTHING;
                    """, (
                        tx.get('id'),
                        clause.get('type'),
                        clause.get('contract'),
                        clause.get('reverted', False),
                        clause.get('timestamp', tx.get('timestamp')),
                    ))
                except Exception as e:
                    print(f"Error inserting clause for tx {tx.get('id')}: {e}")
                    conn.rollback()
                    continue
        conn.commit()
        print(f"Inserted block {block_num}, {len(txs)} transactions.")
        # Respect API rate limit
        print("Sleeping to respect API rate limit...")
        time.sleep(1)  # Adjust as needed for your quota
    cur.close()
    conn.close()
    print("Catchup complete.")

if __name__ == "__main__":
    main()
