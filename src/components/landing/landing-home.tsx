"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight, BookOpen, FileText, Link as LinkIcon, MessageCircle, Plus, Sparkles } from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Card className="notebook-preview gap-0 py-0 shadow-preview">
          <CardHeader className="flex items-center gap-3 px-5 pt-4 pb-3"><span className="book-icon"><BookOpen size={23} strokeWidth={1.5} aria-hidden="true" /></span><div><span className="eyebrow">YOUR NOTEBOOK</span><CardTitle className="mt-1 text-base leading-snug font-medium">{example.title}</CardTitle></div><span className="preview-dots" aria-hidden="true">···</span></CardHeader>
          <CardContent className="px-0">
            <div className="source-row"><span><FileText size={13} aria-hidden="true" />{example.source}</span><span><LinkIcon size={12} aria-hidden="true" />{example.count}</span></div>
            <div className="chat-preview"><div className="question"><span className="avatar" aria-hidden="true">Y</span><p>{example.question}</p></div><div className="answer"><Sparkles size={18} aria-hidden="true" /><div><p>{example.answer}</p><span className="citation"><FileText size={12} aria-hidden="true" />1 · Based on your sources</span></div></div><div className="demo-input" aria-hidden="true"><span>Follow your curiosity…</span><span className="send-icon"><ArrowRight size={16} /></span></div></div>
            <div className="preview-footer"><span><i />Connected to your sources</span><Sparkles size={13} aria-hidden="true" /></div>
          </CardContent>
        </Card>
      </TabsContent>)}
      <div className="preview-controls"><TabsList variant="pill" aria-label="Explore notebook examples">{examples.map(example => <TabsTrigger key={example.name} value={example.name}>{example.name}</TabsTrigger>)}</TabsList><span>One space. Many possibilities.</span></div>
    </Tabs>
    <p className="preview-caption">Illustrative preview · made for curious minds</p>
  </div>;
}

export function LandingHome() {
  return <div className="landing-shell">
    {/* Public-page header stays here, outside the shared platform layout. */}
    <header className="landing-header">
      <Brand />
      <nav className="landing-nav" aria-label="Landing navigation"><a href="#how-it-works">How it works</a><a href="#preview">A little preview <ArrowDown size={13} aria-hidden="true" /></a></nav>
      <Button asChild><Link href="/login">Login with Google <ArrowRight className="header-cta-icon transition-transform group-hover/button:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" /></Link></Button>
    </header>
    <main id="main-content" tabIndex={-1} className="landing-main focus-visible:outline-none">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy"><div className="intro-label"><i />LESS NOISE. MORE UNDERSTANDING.</div><h1 id="hero-title">Your sources.<br />Your thinking.<br /><em>All connected.</em></h1><p className="hero-description">Turn scattered information into clear understanding. Bring your documents, links, and ideas into one thoughtful space.</p>
          <div className="hero-actions">
            <Button size="lg" asChild><Link href="/login">Login with Google <ArrowRight className="transition-transform group-hover/button:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" /></Link></Button>
            <Button variant="link" size="lg" asChild><a href="#preview">Take a little look <ArrowDown className="transition-transform group-hover/button:translate-y-0.5 motion-reduce:transition-none" aria-hidden="true" /></a></Button>
          </div>
          <p className="hero-caption"><span />A little space for your next idea.</p></div>
        <NotebookPreview />
      </section>
      <section className="possibilities" id="how-it-works" aria-labelledby="how-title"><div className="section-intro"><span className="eyebrow text-foreground">A CLEARER WAY TO THINK</span><h2 id="how-title">From a little scattered<br />to a little more connected.</h2></div><div className="feature"><span className="feature-icon"><Plus size={20} aria-hidden="true" /></span><h3>Bring it together</h3><p>PDFs, links, videos, and notes.<br />All your sources, one home.</p></div><div className="feature"><span className="feature-icon"><MessageCircle size={19} aria-hidden="true" /></span><h3>Start a conversation</h3><p>Ask questions. Explore a thought.<br />Find answers in your sources.</p></div><div className="feature"><span className="feature-icon"><Sparkles size={20} aria-hidden="true" /></span><h3>Connect the dots</h3><p>See the bigger picture.<br />Make the understanding yours.</p></div></section>
      <footer className="landing-footer"><span>Built for the way your mind wanders.</span><span>And the moments it all clicks. <Sparkles size={13} aria-hidden="true" /></span></footer>
    </main>
  </div>;
}
