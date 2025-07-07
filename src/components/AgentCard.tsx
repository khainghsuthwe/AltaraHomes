interface AgentCardProps {
  agent: string; // Assuming agent is a string (name or ID); extend with API call if needed
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">Agent Information</h3>
      <p className="text-gray-600">Name: {agent}</p>
      <p className="text-gray-600">Contact: agent@example.com</p>
      <p className="text-gray-600">Phone: (123) 456-7890</p>
    </div>
  );
}