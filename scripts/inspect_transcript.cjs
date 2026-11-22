const fs = require('fs');
const readline = require('readline');

async function extractFiles() {
  const fileStream = fs.createReadStream('/Users/akangromeo/.gemini/antigravity/brain/5c90e841-fff2-4eab-bb4a-16149048c63a/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const lastWrites = new Map();

  for await (const line of rl) {
    if (!line.includes('"write_file"')) continue;
    try {
      const data = JSON.parse(line);
      const calls = data?.tool_calls || [];
      for (const call of calls) {
        if (call.name === 'write_file' && call.args?.Path && call.args?.Content) {
          lastWrites.set(call.args.Path, call.args.Content);
        }
      }
    } catch (e) {}
  }

  console.log(`Found ${lastWrites.size} written files in transcript.`);
  return lastWrites;
}

if (require.main === module) {
  extractFiles().then(map => {
    for (const p of map.keys()) {
      console.log(' - ', p);
    }
  });
}

module.exports = { extractFiles };
