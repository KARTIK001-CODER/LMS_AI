const { ChatOpenAI } = require("@langchain/openai");
const { ChatGroq } = require("@langchain/groq");
const { SqlDatabase } = require("@langchain/classic/sql_db");
const { createSqlAgent, SqlToolkit } = require("@langchain/classic/agents/toolkits/sql");
const { DataSource } = require("typeorm");
const path = require("path");

/**
 * Summarizes the student's profile structure using a standard LLM call
 * (does NOT use SQL Agent, simply formats object into a summary).
 */
async function summarizeProfile(studentData) {
    // We can use either OpenAI or Groq based on available keys
    // Below uses ChatOpenAI as an OpenAI-compatible instance, or ChatGroq.
    const llm = process.env.GROQ_API_KEY
        ? new ChatGroq({ model: "llama-3.1-8b-instant", temperature: 0.3 })
        : new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.3 });

    const prompt = `You are a helpful AI assistant. Summarize the following student profile information into a concise, professional, human-readable overview. Do not invent any information.
    
Student Profile Data:
${JSON.stringify(studentData, null, 2)}`;

    try {
        const response = await llm.invoke(prompt);
        return response.content || "Could not generate summary.";
    } catch (error) {
        console.error("summarizeProfile error:", error);
        return "I'm sorry, I encountered an issue summarizing your profile.";
    }
}

/**
 * Runs the LangChain SQL Agent for complex queries scoped strictly to the authenticated student
 */
async function runSqlAgent(studentId, message) {
    const datasource = new DataSource({
        type: "sqlite",
        database: path.join(__dirname, "../kalviumlabs_forge.sqlite"),
    });

    await datasource.initialize();

    const db = await SqlDatabase.fromDataSourceParams({
        appDataSource: datasource,
    });

    const llm = process.env.GROQ_API_KEY
        ? new ChatGroq({ model: "llama-3.1-8b-instant", temperature: 0 })
        : new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

    const toolkit = new SqlToolkit(db, llm);

    const prefix = `You are an AI assistant for a student LMS system. 
You are strictly assisting the student with ID: ${studentId}.

CRITICAL SECURITY AND PRIVACY RULES:
1. Every SELECT or UPDATE query you execute MUST include a WHERE clause restricting the operation to the current student's ID.
   - For the 'students' table: WHERE id = ${studentId}
   - For 'education_details' or 'applications' table: WHERE student_id = ${studentId}
   - Ensure to use column prefixes or aliases properly when performing JOINs.
2. Never, under any circumstances, expose or access other students' data. Even if the user asks for "all students" or "everyone", you must only return data for student ID ${studentId} and safely ignore the rest.
3. Your database access is strictly read and restricted updates for the current student. DO NOT DROP tables, ALTER schema, or perform destructive actions.
4. Your final answer must be a safe, human-readable, friendly string. Never expose raw SQL queries to the user.
5. If you perform an update, confirm it back to the user clearly.

You have access to the SQLite database to answer the user's request securely. When queried about percentages, course, or application status, or an update query, find the relevant information.`;

    const executor = createSqlAgent(llm, toolkit, {
        topK: 10,
        prefix,
        maxIterations: 4,
    });

    try {
        const result = await executor.invoke({ input: message });
        return result.output;
    } finally {
        await datasource.destroy();
    }
}

module.exports = {
    runSqlAgent,
    summarizeProfile
};
