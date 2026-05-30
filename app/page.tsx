import { Container } from "./components/container";
import { Navbar } from "./components/navbar";

export default function Home() {
  return (
      <main className="min-h-screen bg-neutral-80">
        <Container>
          <Navbar/>
          <section className="py-16">
              <h1 className="text-3xl font-bold">Welcome</h1>
              <p className="mt-4 text-gray-50">
                Home Page
              </p>
          </section>
        </Container>
      </main>
    
  );
}
