import streamlit as st
import requests
from datetime import datetime, timedelta
import os
from collections import defaultdict
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="Insider Trading Monitor",
    page_icon="📈",
    layout="wide"
)

# Configuration
FINNHUB_API_KEY = os.getenv('FINNHUB_API_KEY', 'd42gt9hr01qorlerau8gd42gt9hr01qorlerau90')
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID', '586357283')
GMAIL_USER = os.getenv('GMAIL_USER', '')
GMAIL_PASSWORD = os.getenv('GMAIL_PASSWORD', '')
RECIPIENT_EMAIL = os.getenv('RECIPIENT_EMAIL', 'vaughanfawcett1@gmail.com')
SIGNIFICANCE_THRESHOLD = 50000

def fetch_insider_transactions():
    """Fetch insider transactions from Finnhub API"""
    end_date = datetime.now().strftime('%Y-%m-%d')
    start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')

    url = "https://finnhub.io/api/v1/stock/insider-transactions"
    params = {
        'from': start_date,
        'to': end_date,
        'token': FINNHUB_API_KEY
    }

    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        st.error(f"Error fetching data: {str(e)}")
        return None

def process_transactions(data):
    """Process and filter transactions to get top 5 stocks"""
    if not data or 'data' not in data:
        return []

    transactions = data['data']

    # Group by symbol
    stock_groups = defaultdict(lambda: {'transactions': [], 'total_value': 0})

    for transaction in transactions:
        symbol = transaction.get('symbol', '')
        shares = transaction.get('share', 0)
        price = transaction.get('transactionPrice', 0)
        transaction_code = transaction.get('transactionCode', '')

        value = shares * price

        # Calculate net money flow (positive for buys, negative for sells)
        if transaction_code in ['P', 'M']:  # Purchase codes
            money_flow = value
        else:  # Sale codes
            money_flow = -value

        stock_groups[symbol]['transactions'].append({
            'name': transaction.get('name', 'Unknown'),
            'shares': shares,
            'price': price,
            'value': value,
            'transactionDate': transaction.get('transactionDate', ''),
            'transactionCode': transaction_code
        })
        stock_groups[symbol]['total_value'] += money_flow

    # Sort by absolute value and get top 5
    sorted_stocks = sorted(
        stock_groups.items(),
        key=lambda x: abs(x[1]['total_value']),
        reverse=True
    )[:5]

    result = []
    for symbol, data in sorted_stocks:
        result.append({
            'symbol': symbol,
            'transactions': data['transactions'],
            'net_flow': data['total_value']
        })

    return result

def analyze_stock(stock_data):
    """Analyze a single stock's insider trading activity"""
    symbol = stock_data['symbol']
    transactions = stock_data['transactions']

    # Aggregate by insider
    insider_activity = defaultdict(lambda: {
        'buys': 0, 'sells': 0,
        'buy_value': 0, 'sell_value': 0,
        'transactions': []
    })

    for txn in transactions:
        name = txn['name']
        code = txn['transactionCode']
        value = txn['value']

        insider_activity[name]['transactions'].append(txn)

        if code in ['P', 'M']:  # Buy
            insider_activity[name]['buys'] += 1
            insider_activity[name]['buy_value'] += value
        else:  # Sell
            insider_activity[name]['sells'] += 1
            insider_activity[name]['sell_value'] += value

    # Calculate metrics
    total_buys = sum(data['buys'] for data in insider_activity.values())
    total_sells = sum(data['sells'] for data in insider_activity.values())
    total_buy_value = sum(data['buy_value'] for data in insider_activity.values())
    total_sell_value = sum(data['sell_value'] for data in insider_activity.values())

    net_value = total_buy_value - total_sell_value

    # Determine sentiment
    if total_buys > total_sells * 2:
        sentiment = "🟢 STRONG BUY"
        recommendation = "Strong insider confidence - consider accumulating"
    elif total_buys > total_sells:
        sentiment = "🟢 BUY"
        recommendation = "Positive insider activity - monitor for entry"
    elif total_sells > total_buys * 2:
        sentiment = "🔴 CAUTION"
        recommendation = "Heavy selling - exercise caution"
    elif total_sells > total_buys:
        sentiment = "🟡 MONITOR"
        recommendation = "Mixed signals - wait for clearer direction"
    else:
        sentiment = "⚪ HOLD"
        recommendation = "Balanced activity - maintain positions"

    return {
        'symbol': symbol,
        'sentiment': sentiment,
        'recommendation': recommendation,
        'total_buys': total_buys,
        'total_sells': total_sells,
        'buy_value': total_buy_value,
        'sell_value': total_sell_value,
        'net_value': net_value,
        'insider_count': len(insider_activity),
        'insider_details': insider_activity
    }

def send_telegram_notification(message):
    """Send notification via Telegram"""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return False, "Telegram credentials not configured"

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"

    payload = {
        'chat_id': TELEGRAM_CHAT_ID,
        'text': message,
        'parse_mode': 'HTML'
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return True, "Telegram notification sent successfully"
    except Exception as e:
        return False, f"Telegram error: {str(e)}"

def send_gmail_notification(subject, body):
    """Send notification via Gmail"""
    if not GMAIL_USER or not GMAIL_PASSWORD:
        return False, "Gmail credentials not configured"

    try:
        msg = MIMEMultipart()
        msg['From'] = GMAIL_USER
        msg['To'] = RECIPIENT_EMAIL
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(GMAIL_USER, GMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()

        return True, "Gmail notification sent successfully"
    except Exception as e:
        return False, f"Gmail error: {str(e)}"

def format_telegram_message(analyses):
    """Format message for Telegram"""
    message = "📊 <b>Insider Trading Alert</b>\n\n"
    message += f"<i>Top {len(analyses)} stocks by insider activity (Last 7 days)</i>\n\n"

    for analysis in analyses:
        message += f"<b>{analysis['symbol']}</b> {analysis['sentiment']}\n"
        message += f"├ Buys: {analysis['total_buys']} | Sells: {analysis['total_sells']}\n"
        message += f"├ Net Flow: ${analysis['net_value']:,.0f}\n"
        message += f"└ {analysis['recommendation']}\n\n"

    return message

def format_gmail_message(analyses):
    """Format detailed message for Gmail"""
    html = """
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .stock { margin-bottom: 30px; border-left: 4px solid #007bff; padding-left: 15px; }
            .header { color: #007bff; }
            .metric { margin: 5px 0; }
            .recommendation { background: #f8f9fa; padding: 10px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <h2>Insider Trading Activity Report</h2>
        <p><i>Analysis of top stocks by insider trading activity (Last 7 days)</i></p>
    """

    for analysis in analyses:
        html += f"""
        <div class="stock">
            <h3 class="header">{analysis['symbol']} - {analysis['sentiment']}</h3>
            <div class="metric"><strong>Buy Transactions:</strong> {analysis['total_buys']}</div>
            <div class="metric"><strong>Sell Transactions:</strong> {analysis['total_sells']}</div>
            <div class="metric"><strong>Total Buy Value:</strong> ${analysis['buy_value']:,.2f}</div>
            <div class="metric"><strong>Total Sell Value:</strong> ${analysis['sell_value']:,.2f}</div>
            <div class="metric"><strong>Net Flow:</strong> ${analysis['net_value']:,.2f}</div>
            <div class="metric"><strong>Active Insiders:</strong> {analysis['insider_count']}</div>
            <div class="recommendation">
                <strong>Recommendation:</strong> {analysis['recommendation']}
            </div>
        </div>
        """

    html += """
    </body>
    </html>
    """

    return html

# Streamlit UI
st.title("📈 Insider Trading Activity Monitor")
st.markdown("Get real-time updates on insider trading activity for top stocks")

# Sidebar for configuration status
with st.sidebar:
    st.header("⚙️ Configuration Status")
    st.write("**Finnhub API:**", "✅ Configured" if FINNHUB_API_KEY else "❌ Missing")
    st.write("**Telegram:**", "✅ Configured" if TELEGRAM_BOT_TOKEN else "❌ Missing")
    st.write("**Gmail:**", "✅ Configured" if GMAIL_USER and GMAIL_PASSWORD else "❌ Missing")

    st.markdown("---")
    st.markdown("### 📝 Setup Instructions")
    st.markdown("""
    1. Set environment variables in `.env` file
    2. Click 'Get Update' to fetch data
    3. Notifications will be sent automatically
    """)

# Main button
if st.button("🔄 Get Update", type="primary", use_container_width=True):
    with st.spinner("Fetching insider trading data..."):
        # Fetch data
        data = fetch_insider_transactions()

        if data:
            # Process transactions
            top_stocks = process_transactions(data)

            if top_stocks:
                # Analyze each stock
                analyses = [analyze_stock(stock) for stock in top_stocks]

                # Display results
                st.success(f"Found {len(analyses)} stocks with significant insider activity!")

                # Show analyses
                for analysis in analyses:
                    with st.expander(f"**{analysis['symbol']}** - {analysis['sentiment']}", expanded=True):
                        col1, col2, col3 = st.columns(3)

                        with col1:
                            st.metric("Buy Transactions", analysis['total_buys'])
                            st.metric("Buy Value", f"${analysis['buy_value']:,.0f}")

                        with col2:
                            st.metric("Sell Transactions", analysis['total_sells'])
                            st.metric("Sell Value", f"${analysis['sell_value']:,.0f}")

                        with col3:
                            st.metric("Net Flow", f"${analysis['net_value']:,.0f}")
                            st.metric("Active Insiders", analysis['insider_count'])

                        st.info(f"**Recommendation:** {analysis['recommendation']}")

                # Send notifications
                st.markdown("---")
                st.subheader("📢 Sending Notifications...")

                col1, col2 = st.columns(2)

                with col1:
                    telegram_msg = format_telegram_message(analyses)
                    success, message = send_telegram_notification(telegram_msg)
                    if success:
                        st.success(message)
                    else:
                        st.warning(message)

                with col2:
                    gmail_subject = f"Insider Trading Alert - {len(analyses)} Stocks"
                    gmail_body = format_gmail_message(analyses)
                    success, message = send_gmail_notification(gmail_subject, gmail_body)
                    if success:
                        st.success(message)
                    else:
                        st.warning(message)

            else:
                st.info("No significant insider trading activity found in the last 7 days.")
        else:
            st.error("Failed to fetch data. Please check your API key and try again.")

# Footer
st.markdown("---")
st.markdown("*Data provided by Finnhub API | Updates based on last 7 days of activity*")
