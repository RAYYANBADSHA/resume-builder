# AI Setup Guide

## Using Hugging Face (FREE - Recommended)

Your app now uses **Hugging Face Inference API** which is completely free with generous limits!

### Option 1: Use Mock Responses (No Setup Required)

The app works out of the box with realistic mock AI responses. Perfect for:
- Testing and development
- Demos and presentations
- When you don't want to set up an API key

**No configuration needed!** Just run the app and it will use randomized mock responses.

### Option 2: Use Real AI (Free Hugging Face API)

Get actual AI-powered resume analysis for free:

#### Step 1: Create Hugging Face Account
1. Go to [https://huggingface.co/join](https://huggingface.co/join)
2. Sign up (it's free, no credit card required)
3. Verify your email

#### Step 2: Get Your API Token
1. Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click "New token"
3. Give it a name (e.g., "Resume Analyzer")
4. Select "Read" access (that's all you need)
5. Click "Generate token"
6. Copy your token

#### Step 3: Add Token to Your App
1. Create a `.env` file in your project root (same folder as `package.json`)
2. Add this line:
   ```
   VITE_HUGGINGFACE_API_KEY=your_token_here
   ```
3. Replace `your_token_here` with your actual token

#### Step 4: Restart Your App
```bash
npm run dev
```

That's it! Your app will now use real AI for resume analysis.

---

## How It Works

### With API Key
- Uses Mistral-7B-Instruct model (free on Hugging Face)
- Provides intelligent, context-aware feedback
- Analyzes job descriptions and tailors advice
- Falls back to mock responses if API has issues

### Without API Key (Default)
- Uses randomized mock responses
- Scores vary between 60-95 for realism
- Provides generic but helpful feedback
- Perfect for testing and demos

---

## API Limits

**Hugging Face Free Tier:**
- ✅ No credit card required
- ✅ Generous rate limits (1000+ requests/day)
- ✅ No expiration
- ✅ Multiple models available

If you hit rate limits, the app automatically falls back to mock responses.

---

## Troubleshooting

### "Model is loading" Error
- Hugging Face models may take 20-30 seconds to "wake up" if not used recently
- The app will automatically use mock responses while waiting
- Try again in 30 seconds for real AI responses

### API Key Not Working
1. Check your `.env` file is in the project root
2. Make sure the variable name is exactly: `VITE_HUGGINGFACE_API_KEY`
3. Restart your dev server after adding the key
4. Check browser console for error messages

### Want to Use a Different Model?
Edit `src/lib/ai.ts` and change the `apiEndpoint` to any Hugging Face model:
```typescript
private apiEndpoint = "https://api-inference.huggingface.co/models/YOUR_MODEL_HERE";
```

Popular free models:
- `mistralai/Mistral-7B-Instruct-v0.2` (current, recommended)
- `meta-llama/Llama-2-7b-chat-hf`
- `google/flan-t5-xxl`

---

## Alternative: Use OpenAI (Paid)

If you prefer OpenAI (requires payment):

1. Get API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Modify `src/lib/ai.ts` to use OpenAI's API format
3. Add to `.env`:
   ```
   VITE_OPENAI_API_KEY=your_openai_key
   ```

---

## Summary

**For most users:** Just use the app as-is with mock responses. They work great!

**For real AI:** Get a free Hugging Face token (5 minutes setup, no credit card).

**For production:** Consider OpenAI or other paid services for guaranteed uptime.
