import OpenAI from "openai"
import { getCurrentWeather, getLocation } from "./tools"

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

const availableFunctions = {
    getCurrentWeather,
    getLocation
}

async function agent(query) {
    const messages = [
        { role: "system", content: "You are a helpful AI agent. Give highly specific answers based on the information you're provided. Prefer to gather information with the tools provided to you rather than giving basic, generic answers." },
        { role: "user", content: query }
    ]

    const MAX_ITERATIONS = 5

    // for (let i = 0; i < MAX_ITERATIONS; i++) {
    //     console.log(`Iteration #${i + 1}`)
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages,
            tools
        })

        console.log(response.choices[0])
        const { finish_reason: finishReason, message } = response.choices[0]
        const { tool_calls: toolCalls } = message
        
        if (finishReason === "stop") {
            console.log(message.content)
            console.log("AGENT ENDING")
            return
        } else if (finishReason === "tool_calls") {
            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name
                const functionToCall = availableFunctions[functionName]
                const functionResponse = await functionToCall()
                console.log(functionResponse)
            }
        }
        
        /**
         * Challenge:
         * Write the logic for the "tool_calls" finish reason. 
         * Console.log the function response.
         * Notes:
         * - Assume our functions won't ever have any arguments. We'll
         *   update this later
         * - Notice that "tool_calls" is an array, and account for that
         *   when writing your code
         * - Don't worry about pushing any messages to the messages array yet
         */
        
        
        // Check finish_reason
        // if "stop"
            // return the result
        // else if "tool_calls"
            // call functions
            // append results
            // continue
        
    // }
}

await agent("What's the current weather in Tokyo and New York City and Oslo?")