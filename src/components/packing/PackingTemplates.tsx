'use client'

import {
  Umbrella,
  Building2,
  Mountain,
  Briefcase,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@/components/ui'

export interface PackingTemplateItem {
  name: string
  quantity: number
  isEssential: boolean
}

export interface PackingTemplateCategory {
  name: string
  icon?: string
  items: PackingTemplateItem[]
}

export interface PackingTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  categories: PackingTemplateCategory[]
}

const TEMPLATES: PackingTemplate[] = [
  {
    id: 'beach',
    name: 'Strandurlaub',
    description: 'Alles fuer entspannte Tage am Meer',
    icon: <Umbrella className="h-6 w-6" />,
    categories: [
      {
        name: 'Kleidung',
        icon: '👕',
        items: [
          { name: 'T-Shirts', quantity: 5, isEssential: true },
          { name: 'Shorts', quantity: 3, isEssential: true },
          { name: 'Badehose/Bikini', quantity: 2, isEssential: true },
          { name: 'Leichte Hose', quantity: 1, isEssential: false },
          { name: 'Sommerkleid', quantity: 2, isEssential: false },
          { name: 'Flip-Flops', quantity: 1, isEssential: true },
          { name: 'Sandalen', quantity: 1, isEssential: false },
          { name: 'Unterwaesche', quantity: 7, isEssential: true },
          { name: 'Sonnenhut', quantity: 1, isEssential: true },
        ],
      },
      {
        name: 'Strand',
        icon: '🏖️',
        items: [
          { name: 'Strandtuch', quantity: 2, isEssential: true },
          { name: 'Sonnencreme', quantity: 1, isEssential: true },
          { name: 'Sonnenbrille', quantity: 1, isEssential: true },
          { name: 'Strandtasche', quantity: 1, isEssential: false },
          { name: 'Schnorchel-Set', quantity: 1, isEssential: false },
          { name: 'Wasserball', quantity: 1, isEssential: false },
          { name: 'Strandmuschel', quantity: 1, isEssential: false },
        ],
      },
      {
        name: 'Hygiene',
        icon: '🧴',
        items: [
          { name: 'Zahnbuerste', quantity: 1, isEssential: true },
          { name: 'Zahnpasta', quantity: 1, isEssential: true },
          { name: 'Shampoo', quantity: 1, isEssential: true },
          { name: 'Duschgel', quantity: 1, isEssential: true },
          { name: 'Deodorant', quantity: 1, isEssential: true },
          { name: 'After-Sun-Lotion', quantity: 1, isEssential: false },
          { name: 'Rasierer', quantity: 1, isEssential: false },
        ],
      },
      {
        name: 'Elektronik',
        icon: '📱',
        items: [
          { name: 'Handy-Ladegeraet', quantity: 1, isEssential: true },
          { name: 'Kamera', quantity: 1, isEssential: false },
          { name: 'E-Book-Reader', quantity: 1, isEssential: false },
          { name: 'Powerbank', quantity: 1, isEssential: false },
          { name: 'Kopfhoerer', quantity: 1, isEssential: false },
        ],
      },
    ],
  },
  {
    id: 'city',
    name: 'Staedtereise',
    description: 'Perfekt fuer Sightseeing und Kultur',
    icon: <Building2 className="h-6 w-6" />,
    categories: [
      {
        name: 'Kleidung',
        icon: '👔',
        items: [
          { name: 'T-Shirts', quantity: 4, isEssential: true },
          { name: 'Hemden/Blusen', quantity: 2, isEssential: false },
          { name: 'Jeans', quantity: 2, isEssential: true },
          { name: 'Pullover', quantity: 1, isEssential: true },
          { name: 'Jacke', quantity: 1, isEssential: true },
          { name: 'Bequeme Schuhe', quantity: 1, isEssential: true },
          { name: 'Elegante Schuhe', quantity: 1, isEssential: false },
          { name: 'Unterwaesche', quantity: 5, isEssential: true },
          { name: 'Socken', quantity: 5, isEssential: true },
        ],
      },
      {
        name: 'Dokumente',
        icon: '📄',
        items: [
          { name: 'Reisepass/Ausweis', quantity: 1, isEssential: true },
          { name: 'Kreditkarte', quantity: 1, isEssential: true },
          { name: 'Bargeld', quantity: 1, isEssential: true },
          { name: 'Hotelreservierung', quantity: 1, isEssential: true },
          { name: 'Reiseversicherung', quantity: 1, isEssential: false },
          { name: 'Stadtplan', quantity: 1, isEssential: false },
        ],
      },
      {
        name: 'Elektronik',
        icon: '💻',
        items: [
          { name: 'Handy-Ladegeraet', quantity: 1, isEssential: true },
          { name: 'Kamera', quantity: 1, isEssential: false },
          { name: 'Reiseadapter', quantity: 1, isEssential: true },
          { name: 'Powerbank', quantity: 1, isEssential: true },
          { name: 'Kopfhoerer', quantity: 1, isEssential: false },
        ],
      },
      {
        name: 'Sonstiges',
        icon: '🎒',
        items: [
          { name: 'Tagesrucksack', quantity: 1, isEssential: true },
          { name: 'Regenschirm', quantity: 1, isEssential: false },
          { name: 'Reisefuehrer', quantity: 1, isEssential: false },
          { name: 'Wasserflasche', quantity: 1, isEssential: false },
          { name: 'Snacks', quantity: 1, isEssential: false },
        ],
      },
    ],
  },
  {
    id: 'hiking',
    name: 'Wanderurlaub',
    description: 'Ausruestung fuer Outdoor-Abenteuer',
    icon: <Mountain className="h-6 w-6" />,
    categories: [
      {
        name: 'Kleidung',
        icon: '🥾',
        items: [
          { name: 'Wanderhose', quantity: 2, isEssential: true },
          { name: 'Funktionsshirts', quantity: 4, isEssential: true },
          { name: 'Fleecejacke', quantity: 1, isEssential: true },
          { name: 'Regenjacke', quantity: 1, isEssential: true },
          { name: 'Wanderschuhe', quantity: 1, isEssential: true },
          { name: 'Wandersocken', quantity: 4, isEssential: true },
          { name: 'Muetze', quantity: 1, isEssential: false },
          { name: 'Handschuhe', quantity: 1, isEssential: false },
          { name: 'Unterwaesche', quantity: 5, isEssential: true },
        ],
      },
      {
        name: 'Ausruestung',
        icon: '🎒',
        items: [
          { name: 'Wanderrucksack', quantity: 1, isEssential: true },
          { name: 'Wanderstoecke', quantity: 1, isEssential: false },
          { name: 'Stirnlampe', quantity: 1, isEssential: true },
          { name: 'Taschenmesser', quantity: 1, isEssential: false },
          { name: 'Kompass', quantity: 1, isEssential: false },
          { name: 'Wanderkarte', quantity: 1, isEssential: true },
          { name: 'Trinkflasche', quantity: 1, isEssential: true },
          { name: 'Sitzkissen', quantity: 1, isEssential: false },
        ],
      },
      {
        name: 'Verpflegung',
        icon: '🍎',
        items: [
          { name: 'Muesli-Riegel', quantity: 10, isEssential: true },
          { name: 'Nuesse', quantity: 1, isEssential: false },
          { name: 'Trockenobst', quantity: 1, isEssential: false },
          { name: 'Brotdose', quantity: 1, isEssential: false },
          { name: 'Trinkblase', quantity: 1, isEssential: false },
        ],
      },
      {
        name: 'Erste Hilfe',
        icon: '🏥',
        items: [
          { name: 'Erste-Hilfe-Set', quantity: 1, isEssential: true },
          { name: 'Blasenpflaster', quantity: 5, isEssential: true },
          { name: 'Schmerztabletten', quantity: 1, isEssential: true },
          { name: 'Insektenschutz', quantity: 1, isEssential: true },
          { name: 'Sonnencreme', quantity: 1, isEssential: true },
          { name: 'Rettungsdecke', quantity: 1, isEssential: false },
        ],
      },
    ],
  },
  {
    id: 'business',
    name: 'Geschaeftsreise',
    description: 'Professionell und organisiert unterwegs',
    icon: <Briefcase className="h-6 w-6" />,
    categories: [
      {
        name: 'Kleidung',
        icon: '👔',
        items: [
          { name: 'Anzug/Kostuem', quantity: 2, isEssential: true },
          { name: 'Hemden/Blusen', quantity: 3, isEssential: true },
          { name: 'Krawatte/Tuch', quantity: 2, isEssential: false },
          { name: 'Business-Schuhe', quantity: 1, isEssential: true },
          { name: 'Guertel', quantity: 1, isEssential: true },
          { name: 'Unterwaesche', quantity: 4, isEssential: true },
          { name: 'Socken', quantity: 4, isEssential: true },
          { name: 'Schlafanzug', quantity: 1, isEssential: false },
          { name: 'Sportkleidung', quantity: 1, isEssential: false },
        ],
      },
      {
        name: 'Dokumente',
        icon: '📋',
        items: [
          { name: 'Reisepass/Ausweis', quantity: 1, isEssential: true },
          { name: 'Visitenkarten', quantity: 1, isEssential: true },
          { name: 'Praesentation (USB)', quantity: 1, isEssential: true },
          { name: 'Notizblock', quantity: 1, isEssential: true },
          { name: 'Firmenkreditkarte', quantity: 1, isEssential: true },
          { name: 'Flugtickets', quantity: 1, isEssential: true },
          { name: 'Hotelbestaetigung', quantity: 1, isEssential: true },
        ],
      },
      {
        name: 'Elektronik',
        icon: '💼',
        items: [
          { name: 'Laptop', quantity: 1, isEssential: true },
          { name: 'Laptop-Ladegeraet', quantity: 1, isEssential: true },
          { name: 'Handy-Ladegeraet', quantity: 1, isEssential: true },
          { name: 'Reiseadapter', quantity: 1, isEssential: true },
          { name: 'Kopfhoerer', quantity: 1, isEssential: false },
          { name: 'HDMI-Kabel', quantity: 1, isEssential: false },
          { name: 'USB-Stick', quantity: 1, isEssential: true },
        ],
      },
      {
        name: 'Hygiene',
        icon: '🧳',
        items: [
          { name: 'Zahnbuerste', quantity: 1, isEssential: true },
          { name: 'Zahnpasta', quantity: 1, isEssential: true },
          { name: 'Deodorant', quantity: 1, isEssential: true },
          { name: 'Parfuem/Aftershave', quantity: 1, isEssential: false },
          { name: 'Rasierer', quantity: 1, isEssential: true },
          { name: 'Haarbuerste', quantity: 1, isEssential: false },
          { name: 'Medikamente', quantity: 1, isEssential: false },
        ],
      },
    ],
  },
]

interface PackingTemplatesProps {
  onSelect: (template: PackingTemplate) => void
  onCancel: () => void
}

export function PackingTemplates({ onSelect, onCancel }: PackingTemplatesProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Vorlage auswaehlen</h3>
        <p className="text-sm text-muted-foreground">
          Waehle eine Vorlage als Ausgangspunkt fuer deine Packliste
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer transition-colors hover:bg-accent/50"
            onClick={() => onSelect(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {template.icon}
                </div>
                <div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {template.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1">
                {template.categories.map((category) => (
                  <span
                    key={category.name}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
                  >
                    {category.icon && (
                      <span role="img" aria-hidden="true">
                        {category.icon}
                      </span>
                    )}
                    {category.name}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {template.categories.reduce((sum, cat) => sum + cat.items.length, 0)} Items
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
      </div>
    </div>
  )
}
