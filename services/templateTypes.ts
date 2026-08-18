// Mirrors moi-app-backend's TemplateResponseDto / CreateTemplateDto.
export interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateInput {
  name: string;
  subject: string;
  body: string;
  isDefault?: boolean;
}
