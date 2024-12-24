import React, { useState } from 'react';
import { Terminal as TerminalIcon, Power, ChevronRight, ChevronLeft, Menu } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { docs } from '../../data/docs';

export interface Section {
  id: string;
  title: string;
  content: {
    type: 'text' | 'structured';
    lines?: Array<string | { label: string; value: string } | { type: 'list'; items: string[] }>;
    sections?: {
      heading?: string;
      items?: { number: string; text: string }[];
      text?: string[];
      value?: string;
      commands?: { command: string; description: string }[];
    }[];
  };
}

export interface Category {
  id: string;
  title: string;
  sections: Section[];
}

export const Docs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(docs[0]);
  const [selectedSection, setSelectedSection] = useState(docs[0].sections[0]);
  const [showNav, setShowNav] = useState(false);
  const isMobile = useIsMobile();

  const toggleNav = () => setShowNav(!showNav);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSection(category.sections[0]);
    if (isMobile) setShowNav(false);
  };

  const handleSectionSelect = (section: Section) => {
    setSelectedSection(section);
    if (isMobile) setShowNav(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col bg-black/80 backdrop-blur-md rounded-lg border border-pink-500/30 shadow-lg shadow-pink-500/20 h-[600px]">
        {/* Header */}
        <div className="flex items-center gap-2 p-3 border-b border-pink-500/30 bg-black/40">
          {isMobile && (
            <button
              onClick={toggleNav}
              className="text-pink-500 hover:text-cyan-400 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <TerminalIcon className="w-5 h-5 text-pink-500" />
          <span className="text-pink-500 font-mono text-base">SYMBaiEX://docs</span>
          <Power className="w-5 h-5 text-cyan-400 ml-auto" />
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Categories */}
          <div className={`${
            isMobile 
              ? `absolute inset-0 z-10 bg-black/95 transform transition-transform duration-300 ${
                  showNav ? 'translate-x-0' : '-translate-x-full'
                }`
              : 'w-48 border-r border-pink-500/30'
          } overflow-y-auto`}>
            <div className="p-2">
              {isMobile && showNav && (
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className="text-cyan-400 font-mono text-sm">Navigation</span>
                  <button
                    onClick={toggleNav}
                    className="text-pink-500 hover:text-cyan-400 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              )}
              {docs.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-left px-3 py-2 rounded font-mono text-sm transition-colors ${
                    selectedCategory.id === category.id
                      ? 'bg-pink-500/20 text-cyan-400'
                      : 'text-pink-500 hover:bg-pink-500/10'
                  }`}
                >
                  {category.title}
                </button>
              ))}
              {isMobile && selectedCategory && (
                <>
                  <div className="h-px bg-pink-500/30 my-2" />
                  {selectedCategory.sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionSelect(section)}
                      className={`w-full text-left px-3 py-2 rounded font-mono text-sm transition-colors flex items-center justify-between ${
                        selectedSection.id === section.id
                          ? 'bg-pink-500/20 text-cyan-400'
                          : 'text-pink-500 hover:bg-pink-500/10'
                      }`}
                    >
                      <span>{section.title}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Sections */}
          {!isMobile && <div className="w-48 border-r border-pink-500/30 overflow-y-auto">
            <div className="p-2">
              {selectedCategory.sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => handleSectionSelect(section)}
                  className={`w-full text-left px-3 py-2 rounded font-mono text-sm transition-colors flex items-center justify-between ${
                    selectedSection.id === section.id
                      ? 'bg-pink-500/20 text-cyan-400'
                      : 'text-pink-500 hover:bg-pink-500/10'
                  }`}
                >
                  <span>{section.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <h2 className="text-cyan-400 font-mono text-lg">{selectedSection.title}</h2>
              <div className="space-y-4 font-mono text-sm">
                {selectedSection.content.type === 'text' && (
                  <div className="space-y-4">
                    {selectedSection.content.lines?.map((line, index) => {
                      if (typeof line === 'string') {
                        return (
                          <p key={index} className="text-pink-400">
                            {line}
                          </p>
                        );
                      }
                      
                      if ('label' in line && 'value' in line) {
                        return (
                          <p key={index} className="flex items-center gap-2">
                            <span className="text-cyan-400">{line.label}:</span>
                            <span className="text-pink-400">{line.value}</span>
                          </p>
                        );
                      }
                      
                      if ('type' in line && line.type === 'list') {
                        return (
                          <div key={index} className="space-y-2 pl-4">
                            {line.items.map((item, i) => (
                              <p key={i} className="flex items-start gap-2">
                                <span className="text-cyan-400">•</span>
                                <span className="text-pink-400">{item}</span>
                              </p>
                            ))}
                          </div>
                        );
                      }
                      
                      return null;
                    })}
                  </div>
                )}

                {selectedSection.content.type === 'structured' && (
                  <div className="space-y-6">
                    {selectedSection.content.sections?.map((section, i) => (
                      <div key={i} className="space-y-3">
                        {section.heading && (
                          <h3 className="text-cyan-400 font-semibold mb-2">
                            {section.heading}
                          </h3>
                        )}
                        
                        {section.items && (
                          <div className="space-y-2 pl-4">
                            {section.items.map((item, j) => (
                              <p key={j} className="flex items-start gap-2">
                                <span className="text-cyan-400 w-4">
                                  {item.number}.
                                </span>
                                <span className="text-pink-400">
                                  {item.text}
                                </span>
                              </p>
                            ))}
                          </div>
                        )}

                        {section.text && section.text.map((text, k) => (
                          <p 
                            key={k} 
                            className="text-pink-400"
                            dangerouslySetInnerHTML={{ 
                              __html: text.includes('href=') ? text : text.replace(/\n/g, '<br/>') 
                            }}
                          />
                        ))}

                        {section.commands && (
                          <div className="space-y-2">
                            {section.commands.map((cmd, j) => (
                              <p key={j} className="flex items-start gap-2">
                                <span className="text-cyan-400 whitespace-nowrap">
                                  {cmd.command}
                                </span>
                                <span className="text-pink-400">
                                  - {cmd.description}
                                </span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};