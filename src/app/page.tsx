export default function Home() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-between p-8 mt-16">
			<div className="w-full max-w-3xl text-center mt-4">
				<h1 className="text-4xl font-bold mb-4">Clemson Forge</h1>
				<p className="text-xl mt-8">
					Clemson Forge is a student-run organization at Clemson
					University geared towards computer science students.
				</p>
			</div>

			<div className="w-full max-w-3xl mt-12">
				<h2 className="text-2xl font-semibold mb-4 text-center">
					Our Mission
				</h2>
				<p className="text-lg">
					Our goal is to empower computer science students to build
					meaningful projects that enhance their resumes and practical
					skills. By providing resources, mentorship, and
					collaborative opportunities, we help students transform
					classroom knowledge into real-world applications.
				</p>
				<p className="text-lg mt-4">
					Each student is paired with a mentor who guides them through
					creating a project from the basics. Our mentors help with
					everything from git and environment setup to developing
					complex projects.
				</p>
				<p className="text-lg mt-4">
					Whether you're a beginner looking to start your first
					project or an experienced developer wanting to tackle new
					challenges, Clemson Forge provides the community and support
					to help you succeed.
				</p>
			</div>
			<div className="w-full max-w-3xl mt-12">
				<h2 className="text-2xl font-semibold mb-6 text-center">
					Project Categories
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="dark:bg-gray-900 bg-gray-400 p-6 rounded-lg shadow-md">
						<h3 className="text-xl font-semibold mb-3">
							Web/App Development
						</h3>
						<p>
							Build responsive websites and mobile applications
							using modern frameworks and technologies.
						</p>
					</div>
					<div className="dark:bg-gray-900 bg-gray-400 p-6 rounded-lg shadow-md">
						<h3 className="text-xl font-semibold mb-3">AI/ML</h3>
						<p>
							Explore data science, neural networks, and
							generative AI through practical projects.
						</p>
					</div>
					<div className="dark:bg-gray-900 bg-gray-400 p-6 rounded-lg shadow-md">
						<h3 className="text-xl font-semibold mb-3">Hardware</h3>
						<p>
							Work with embedded systems, and hardware
							integrations for real-world applications.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
