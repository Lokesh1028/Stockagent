# 📈 Insider Trading Activity Monitor

A simple Streamlit application that monitors insider trading activity for top stocks and sends notifications via Telegram and Gmail.

## Features

- 📊 Fetch real-time insider trading data from Finnhub API
- 🔍 Analyze top 5 stocks by insider trading volume
- 💡 Get buy/sell recommendations based on insider activity
- 📱 Send alerts via Telegram
- 📧 Send detailed reports via Gmail
- 🎯 Simple one-button interface - no login required!

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
FINNHUB_API_KEY=your_finnhub_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_gmail_app_password
RECIPIENT_EMAIL=recipient@gmail.com
```

### 3. Run the Application

```bash
streamlit run app.py
```

The app will open in your browser at `http://localhost:8501`

## Configuration Guide

### Finnhub API Key

1. Go to [https://finnhub.io/register](https://finnhub.io/register)
2. Sign up for a free account
3. Copy your API key
4. Add it to `.env` as `FINNHUB_API_KEY`

**Note:** A default API key is included in `.env.example` for testing purposes.

### Telegram Setup

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` and follow the instructions
3. Copy the bot token you receive
4. Add it to `.env` as `TELEGRAM_BOT_TOKEN`

To get your Chat ID:
1. Start a chat with your bot
2. Send any message
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for `"chat":{"id":123456789}` in the response
5. Add the ID to `.env` as `TELEGRAM_CHAT_ID`

### Gmail Setup

For security, Gmail requires an App Password (not your regular password):

1. Go to your [Google Account](https://myaccount.google.com/)
2. Select **Security**
3. Under "Signing in to Google," select **2-Step Verification** and enable it
4. Go back to **Security** > **App passwords**
5. Select **Mail** and your device
6. Generate the password
7. Add it to `.env` as `GMAIL_PASSWORD`
8. Add your Gmail address as `GMAIL_USER`
9. Add recipient email as `RECIPIENT_EMAIL`

## How to Use

1. Click the **"Get Update"** button
2. Wait for the data to be fetched and analyzed
3. View the results on the screen
4. Notifications will be automatically sent to Telegram and Gmail

## Features Explained

### Stock Analysis

The app analyzes insider trading activity and provides:

- **Buy/Sell Counts**: Number of buy and sell transactions
- **Transaction Values**: Total value of buys and sells
- **Net Flow**: Net money movement (buys - sells)
- **Active Insiders**: Number of insiders trading
- **Sentiment Score**: Overall market sentiment
- **Recommendation**: Investment recommendation based on activity

### Sentiment Levels

- 🟢 **STRONG BUY**: Heavy insider buying activity
- 🟢 **BUY**: Positive insider activity
- ⚪ **HOLD**: Balanced activity
- 🟡 **MONITOR**: Mixed signals
- 🔴 **CAUTION**: Heavy selling activity

## Troubleshooting

### "Failed to fetch data"
- Check your Finnhub API key is correct
- Ensure you have an active internet connection
- Verify the API key hasn't exceeded its rate limit

### "Telegram credentials not configured"
- Ensure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set in `.env`
- Verify the bot token is correct
- Make sure you've started a chat with your bot

### "Gmail credentials not configured"
- Ensure you're using an App Password, not your regular Gmail password
- Verify 2-Step Verification is enabled on your Google Account
- Check that `GMAIL_USER` and `GMAIL_PASSWORD` are correct in `.env`

### "Gmail error: Authentication failed"
- Make sure you're using an App Password
- Try generating a new App Password
- Verify the email address is correct

## Data Source

All insider trading data is provided by [Finnhub.io](https://finnhub.io)

The app analyzes data from the last 7 days and focuses on the top 5 stocks by trading volume.

## Requirements

- Python 3.8+
- Internet connection
- Valid API credentials (Finnhub, Telegram, Gmail)

## Notes

- The free Finnhub API has rate limits - avoid clicking the button too frequently
- Gmail may take a few seconds to send emails
- Telegram notifications are sent instantly
- All credentials are stored locally in your `.env` file and never shared

## Support

If you encounter any issues:
1. Check the configuration status in the sidebar
2. Verify all environment variables are set correctly
3. Review the error messages displayed in the app
4. Ensure all dependencies are installed

## License

This project is provided as-is for monitoring insider trading activity.
