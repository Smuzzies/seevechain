import requests
import datetime

API_KEY = '9fb48f11f0fdd8a01b7fdfef850159317edf0afa79c7aa75947a29d461baae1b'

def fetch_data(date):
    """
    Fetches data from the VeChainStats API.
    Args:
        date (str): The date for which to fetch data (format: YYYY-MM-DD).
    Returns:
        dict: The API response data.
    """
    url = 'https://api.vechainstats.com/v2/block/stats'
    params = {
        'date': date,
        'expanded': 'true',
        'VCS_API_KEY': API_KEY
    }
    response = requests.get(url, params=params)
    response.raise_for_status()  # Raise an exception for non-2xx status codes
    return response.json()

def format_sql_update(data):
    """
    Formats the API response data as an SQL UPDATE statement.
    Args:
        data (dict): The API response data.
    Returns:
        str: The formatted SQL UPDATE statement.
    """
    date_str = data['meta']['date']
    vtho_burn = data['data']['vtho_total_burned']
    transaction_count = data['data']['txns_total_count']
    clause_count = data['data']['clauses_total_count']
    vtho_burn_usd = 0  # The API response does not seem to include this value
    update_stmt = f"UPDATE public.daily_stats "
    update_stmt += f"SET vtho_burn = {vtho_burn}, transaction_count = {transaction_count}, "
    update_stmt += f"clause_count = {clause_count}, vtho_burn_usd = {vtho_burn_usd} "
    update_stmt += f"WHERE day = '{date_str}';"
    return update_stmt

def date_range(start_date, end_date):
    """
    Generates a range of dates.
    Args:
        start_date (datetime.date): The start date.
        end_date (datetime.date): The end date.
    Yields:
        str: Date strings in YYYY-MM-DD format.
    """
    for n in range(int((end_date - start_date).days) + 1):
        yield (start_date + datetime.timedelta(n)).strftime("%Y-%m-%d")

if __name__ == "__main__":
    start_date_str = input("Enter the start date (YYYY-MM-DD): ")
    end_date_str = input("Enter the end date (YYYY-MM-DD): ")

    try:
        start_date = datetime.datetime.strptime(start_date_str, "%Y-%m-%d").date()
        end_date = datetime.datetime.strptime(end_date_str, "%Y-%m-%d").date()

        print("BEGIN;")  # Start a transaction

        for date in date_range(start_date, end_date):
            try:
                data = fetch_data(date)
                sql_update = format_sql_update(data)
                print(sql_update)
            except requests.exceptions.RequestException as e:
                print(f"-- Error fetching data for {date}: {e}")

        print("COMMIT;")  # End the transaction

    except ValueError:
        print("-- Invalid date format. Please use YYYY-MM-DD.")
    except requests.exceptions.RequestException as e:
        print(f"-- Error: {e}")