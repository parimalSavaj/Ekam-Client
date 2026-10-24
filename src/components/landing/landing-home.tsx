"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, BookOpen, Check, FileText, Layers, Link as LinkIcon, MessageCircle, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const examples = [
  { name: "Research", question: "What connects these ideas?", answer: "Your sources share a simple idea: the best thinking happens when we connect what we already know with something new.", title: "The art of paying attention", source: "Research notes.pdf", count: "3 sources" },
  { name: "Learning", question: "Help me understand the big picture.", answer: "Start with the core concepts, then explore how they fit together. Your notes turn a complex topic into smaller, connected ideas.", title: "A new way to learn", source: "Learning notes.pdf", count: "4 sources" },
  { name: "Ideas", question: "Where could this idea take me?", answer: "There’s a thread worth following here: combine the patterns in your notes with a fresh perspective to find your next starting point.", title: "Small sparks, big possibilities", source: "Collected ideas.pdf", count: "2 sources" },
];

function NotebookPreview() {
  return <div className="preview-wrap" id="preview">
    <div className="preview-overline"><Sparkles size={14} aria-hidden="true" /> A SMALL GLIMPSE OF WHAT’S POSSIBLE</div>
    <Tabs defaultValue="Research" className="notebook-tabs">
      {examples.map(example => <TabsContent key={example.name} value={example.name} className="preview-tab-content">
        <Card className="notebook-preview">
          <CardHeader className="preview-heading"><span className="book-icon"><BookOpen size={23} strokeWidth={1.5} aria-hidden="true" /></span><div><span className="eyebrow">YOUR NOTEBOOK</span><CardTitle className="notebook-title">{example.title}</CardTitle></div><span className="preview-dots" aria-hidden="true">···</span></CardHeader>
          <CardContent className="preview-content">
            <div className="source-row"><span><FileText size={13} aria-hidden="true" />{example.source}</span><span><LinkIcon size={12} aria-hidden="true" />{example.count}</span></div>
            <div className="chat-preview"><div className="question"><span className="avatar" aria-hidden="true">Y</span><p>{example.question}</p></div><div className="answer"><Sparkles size={18} aria-hidden="true" /><div><p>{example.answer}</p><span className="citation"><FileText size={12} aria-hidden="true" />1 · Based on your sources</span></div></div><div className="demo-input" aria-hidden="true"><span>Follow your curiosity…</span><span className="send-icon"><ArrowRight size={16} /></span></div></div>
            <div className="preview-footer"><span><i />Connected to your sources</span><Sparkles size={13} aria-hidden="true" /></div>
          </CardContent>
        </Card>
      </TabsContent>)}
      <div className="preview-controls"><TabsList className="preview-tabs" aria-label="Explore notebook examples">{examples.map(example => <TabsTrigger className="preview-tab" key={example.name} value={example.name}>{example.name}</TabsTrigger>)}</TabsList><span>One space. Many possibilities.</span></div>
    </Tabs>
    <p className="preview-caption">Illustrative preview · made for curious minds</p>
  </div>;
}

export function LandingHome() {
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  return <div className="landing-shell">
    {/* Public-page header stays here, outside the shared platform layout. */}
    <header className="landing-header">
      <Link className="brand" href="/" aria-label="Ekam home"><Layers size={27} strokeWidth={1.7} aria-hidden="true" /><span>ekam<b>.</b></span></Link>
      <nav className="landing-nav" aria-label="Landing navigation"><a href="#how-it-works">How it works</a><a href="#preview">A little preview <ArrowDown size={13} aria-hidden="true" /></a></nav>
      <Button className="header-cta" aria-describedby="workspace-note" onClick={() => setWelcomeOpen(true)}>Get started <ArrowRight size={15} aria-hidden="true" /></Button>
    </header>
    <main className="landing-main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy"><div className="intro-label"><i />LESS NOISE. MORE UNDERSTANDING.</div><h1 id="hero-title">Your sources.<br />Your thinking.<br /><em>All connected.</em></h1><p className="hero-description">Turn scattered information into clear understanding. Bring your documents, links, and ideas into one thoughtful space.</p><div className="hero-actions"><Button className="hero-cta" aria-describedby="workspace-note" onClick={() => setWelcomeOpen(true)}>Get started <ArrowRight size={17} aria-hidden="true" /></Button><Button variant="ghost" className="preview-link" asChild><a href="#preview">Take a little look <ArrowDown size={15} aria-hidden="true" /></a></Button></div><p className="hero-caption" id="workspace-note"><span />Explore the preview. Your workspace is coming soon.</p></div>
        <NotebookPreview />
      </section>
      <section className="possibilities" id="how-it-works" aria-labelledby="how-title"><div className="section-intro"><span>A CLEARER WAY TO THINK</span><h2 id="how-title">From a little scattered<br />to a little more connected.</h2></div><div className="feature"><span className="feature-icon"><Plus size={20} aria-hidden="true" /></span><h3>Bring it together</h3><p>PDFs, links, videos, and notes.<br />All your sources, one home.</p></div><div className="feature"><span className="feature-icon"><MessageCircle size={19} aria-hidden="true" /></span><h3>Start a conversation</h3><p>Ask questions. Explore a thought.<br />Find answers in your sources.</p></div><div className="feature"><span className="feature-icon"><Sparkles size={20} aria-hidden="true" /></span><h3>Connect the dots</h3><p>See the bigger picture.<br />Make the understanding yours.</p></div></section>
      <footer className="landing-footer"><span>Built for the way your mind wanders.</span><span>And the moments it all clicks. <Sparkles size={13} aria-hidden="true" /></span></footer>
    </main>
    <Dialog open={welcomeOpen} onOpenChange={setWelcomeOpen}><DialogContent className="welcome-dialog"><span className="dialog-mark"><Check size={24} aria-hidden="true" /></span><DialogHeader><p className="eyebrow">A NEW SPACE FOR YOUR IDEAS</p><DialogTitle className="welcome-title">This is just the beginning.</DialogTitle><DialogDescription className="welcome-description">Your thinking space is taking shape. Notebook creation and sign-in are coming in the next stage.</DialogDescription></DialogHeader><Button className="dialog-cta" asChild><a href="#preview" onClick={() => setWelcomeOpen(false)}>Explore the preview <ArrowRight size={16} aria-hidden="true" /></a></Button></DialogContent></Dialog>
  </div>;
}
